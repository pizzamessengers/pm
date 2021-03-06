<?php

namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Validation\Rule;
use App\Author;
use App\Dialog;
use App\Messenger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Jobs\StoreAuthors;
use InstagramAPI\Instagram;
use \telegramBot;
use InstagramAPI\Response\Model\DirectThread;

class DialogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Create vk dialog.
     *
     * @param object $dialogs
     * @param Messenger $messenger
     * @param bool $afterQuery
     * @return \Illuminate\Http\Response
     */
    private function addDialogsVk(object $dialogs, Messenger $messenger, bool $afterQuery)
    {
      $dialogList = array();

      if ($afterQuery)
      {
        $vkChat = $dialogs->items[0];
        if (Dialog::where([
          ['dialog_id', $vkChat->peer->id],
          ['messenger_id', $messenger->id]
        ])->first() !== null)
        {
          return array(
            'success' => false,
            'message' => 'dialog.error.added',
          );
        }

        $profiles_lastMessage = json_decode(file_get_contents(
          'https://api.vk.com/method/execute.proflm?peer_id='.$vkChat->peer->id.'&message_ids='.$vkChat->last_message_id.
          '&access_token='.$messenger->token.'&v=5.92'
        ))->response;

        $profiles = $profiles_lastMessage->profiles;
        $lastMessage = $profiles_lastMessage->last_message;
        $dialogData = $this->dialogIdNamePhotoMembers($vkChat, $dialogs);

        $lastMessageText = $lastMessage->text;
        if (strlen($lastMessageText) > 40)
        {
          $lastMessageText = mb_substr($lastMessageText, 0, 40, 'UTF-8').'...';
        }

        $dialog = Dialog::create([
          'name' => $dialogData['name'],
          'messenger_id' => $messenger->id,
          'dialog_id' => (string) $vkChat->peer->id,
          'last_message' => array(
            'text' => $lastMessageText,
            'timestamp' =>  $lastMessage->date.'000',
            'with_attachments' => count($lastMessage->attachments) > 0,
          ),
          'members_count' => $dialogData['members_count'],
          'photo' => $dialogData['photo'],
        ]);

        StoreAuthors::dispatch('vk', $profiles, $dialog->id);
        $dialogList[] = $dialog;
      }
      else
      {
        foreach ($dialogs as $dialog)
        {
          if (Dialog::where([
            ['dialog_id', $dialog['dialog_id']],
            ['messenger_id', $messenger->id]
          ])->first() !== null)
          {
            return array(
              'success' => false,
              'message' => 'dialog.error.added',
            );
          }

          $profiles = json_decode(file_get_contents(
            'https://api.vk.com/method/execute.convMembers?peer_id='.$dialog['dialog_id'].'&access_token='.$messenger->token.'&v=5.92'
          ))->response->profiles;

          $dialog = Dialog::create([
            'name' => $dialog['name'],
            'messenger_id' => $messenger->id,
            'dialog_id' => (string) $dialog['dialog_id'],
            'last_message' => $dialog['last_message'],
            'members_count' => $dialog['members_count'],
            'photo' => $dialog['photo'],
          ]);

          StoreAuthors::dispatch('vk', $profiles, $dialog->id);
          $dialogList[] = $dialog;
        }
      }

      return array(
        'success' => true,
        'dialogList' => $dialogList
      );
    }

    /**
     * Create inst dialog.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    private function addDialogsInst(Request $request)
    {
      $dialogList = array();

      $messenger = $request->user()->inst();

      $inst = new Instagram(false, false);
      try {
          $inst->login($messenger->login, $messenger->password);
      } catch (\Exception $e) {
          info('Something went wrong: '.$e->getMessage());
          exit(0);
      }
      $users = explode(',', $request->q);
      $userIds = array();
      foreach ($users as $user)
      {
        try
        {
          $userId = $inst->people->getUserIdForName($user);
        }
        catch (\InstagramAPI\Exception\NotFoundException $e)
        {
          return array(
            'success' => false,
            'message' => 'all.error.user.'.$user
          );
        }
        array_push($userIds, $userId);
      }

      $thread = $inst->direct->getThreadByParticipants($userIds)->getThread();

      if (!$thread)
      {
        return array(
          'success' => false,
          'message' => 'dialog.error.users'
        );
      }

      if (Dialog::where('dialog_id', $thread->getThreadId())
        ->where('messenger_id', $messenger->id)->count() !== 0)
      {
        return array(
          'success' => false,
          'message' => 'dialog.error.added',
        );
      }

      $profiles = $thread->getUsers();
      $lastItem = $thread->getLastPermanentItem();

      $lastMessageText = $lastItem->getText();
      if ($lastMessageText === null)
      {
        $lastMessageText = '';
      }
      else if (strlen($lastMessageText) > 40)
      {
        $lastMessageText = mb_substr($lastMessageText, 0, 40, 'UTF-8').'...';
      }

      if (count($profiles) === 1)
      {
        $photo = $profiles[0]->getProfilePicUrl();
      }
      else $photo = 'https://vk.com/images/camera_100.png';

      $dialog = Dialog::create([
        'name' => $thread->getThreadTitle(),
        'messenger_id' => $messenger->id,
        'dialog_id' => $thread->getThreadId(),
        'last_message' => array(
          'id' => $lastItem->getItemId(),
          'text' => $lastMessageText,
          'timestamp' => substr($lastItem->getTimestamp(), 0, 13),
          'with_attachments' => $lastItem->getItemType() !== 'text'
        ),
        'members_count' => count($thread->getUsers()) + 1,
        'photo' => $photo,
      ]);
      $dialogList[] = $dialog;

      StoreAuthors::dispatch('inst', $profiles, $dialog->id);

      return array(
        'success' => true,
        'dialogList' => $dialogList
      );
    }

    /**
     * Create tlgrm dialog.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    private function addDialogsTlgrm(Request $request)
    {
      $user = $request->user();
      $token = $request->q;

      try {
        $tg = new telegramBot($token);
        $name = $tg->getMe()['result']['first_name'];
      } catch (\Exception $e) {
        return response()->json([
          'success' => false,
          'message' => 'messenger.error.token',
        ], 404);
      }

      $apiToken = $user->api_token;
      $tg->setWebhook($request->root().'/api/v1/messages/tlgrm?api_token='.$apiToken);

      $dialog = Dialog::create([
        'name' => $name,
        'messenger_id' => $user->tlgrm()->id,
        'dialog_id' => $token,
        'last_message' => array(
          'id' => null,
          'text' => 'no messages',
          'timestamp' => time(),
          'with_attachments' => false
        ),
        'members_count' => 0,
        'photo' => 'https://vk.com/images/camera_100.png',
      ]);

      return array(
        'success' => true,
        'dialogList' => [$dialog]
      );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $query
     * @param Messenger $messenger
     * @return \Illuminate\Http\Response
     */
    public function processQueryVk(string $q, Messenger $messenger)
    {
      $vkRes = json_decode(file_get_contents(
        'https://api.vk.com/method/execute.searchConv?q='.urlencode($q).'&access_token='.$messenger->token.'&v=5.92'
      ))->response;

      if (($count = $vkRes->count) !== 1)
      {
        return $this->notTheOnly($count, $vkRes, $messenger->token);
      }

      return $this->addDialogsVk($vkRes, $messenger, true);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDialogs(Request $request)
    {
      if (Validator::make($request->all(), [
        'mess' => [
          'required',
          Rule::in(['vk', 'inst', 'wapp', 'tlgrm']),
        ],
        'q' => [
          'string',
        ],
      ])->fails()) {
        return response()->json([
          'success' => false,
          'message' => 'all.error.hack',
        ]);
      };

      switch ($request->mess) {
        case 'vk':
          /*$messenger = $request->user()->vk();
          $result = isset($request->q) ?
            $this->processQueryVk($request->q, $messenger) :
            $this->addDialogsVk((object) $request->dialogs, $messenger, false);*/
          break;
        case 'inst':
          $result = $this->addDialogsInst($request);
          break;
        case 'wapp':
          $result = $this->addWapp($request);
          break;
        case 'tlgrm':
          $result = $this->addDialogsTlgrm($request);
          break;
      }

      return response()->json($result, 200);
    }

    /**
     * Get urls for vk attachments
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function getVkAttaUrls(Request $request)
    {
      $dialog = Dialog::find($request->dialog_id);
      $response = json_decode(file_get_contents(
        "https://api.vk.com/method/execute.getAttaUrls?peer_id=".
        $dialog->dialog_id."&access_token=".
        $request->token."&v=5.95"
      ))->response;

      $photoUrl = json_decode(file_get_contents(
        'https://api.vk.com/method/photos.getMessagesUploadServer?peer_id='.
        $dialog->dialog_id.'&access_token='.$dialog->token.'&v=5.95'
      ))->response->upload_url;

      $response->photoUrl = $photoUrl;

      return response()->json([
        'success' => true,
        'response' => $response
      ], 200);
    }

    /**
     * Refresh vk groups list
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function vkRefresh(Request $request)
    {
      $vk = $request->user()->vk();

      $groups = json_decode(file_get_contents(
        'https://api.vk.com/method/execute.getGroups?access_token='.
        $vk->token.'&v=5.95'
      ))->response;

      $existsDialogs = $vk->dialogs()->where('group', true)->get();
      $dialogs = array();

      foreach ($groups as $group) {
        $id = $group->id;

        if (!Dialog::where([
            ['dialog_id', $id],
            ['messenger_id', $vk->id]
          ])->exists()) {

          $dialog = Dialog::create([
            'name' => $group->name,
            'messenger_id' => $vk->id,
            'dialog_id' => $id,
            'members_count' => 0,
            'photo' => $group->photo_100,
            'last_message' => array(
              'text' => '',
              'timestamp' => '',
              'with_attachments' => false,
            ),
            'updating' => false,
            'group' => true
          ]);

          $dialogs[] = $dialog;
        } else {
          $dialogs[] = $existsDialogs->where('dialog_id', $id)->first();
          $i = $existsDialogs->search(function($dialog) use ($group) {
            return $dialog->dialog_id === $id;
          });
          $existsDialogs->forget($i);
        }
      }

      $existsDialogs->each(function($dialog) {
        $dialog->delete();
      });

      return response()->json([
        'success' => true,
        'dialogs' => $dialogs
      ]);
    }

    /**
     * if count of dialogs more or less than 1
     *
     * @param  int $count
     * @param  object $dialogsVk
     * @param  string $token
     * @return array response data
     */
    private function notTheOnly(int $count, object $dialogsVk, string $token)
    {
      if ($count === 0)
      {
        return array(
          'success' => false,
          'message' => 'dialog.error.query',
        );
      }
      else if ($count > 1)
      {
        $dialogs = $this->dialogs($dialogsVk, $token);

        return array(
          'success' => true,
          'needChoose' => true,
          'dialogs' => $dialogs,
        );
      }
    }

    /**
     * Create dialog array
     *
     * @param object $dialogsVk
     * @param string $token
     * @return array $dialogs
     */
    public function dialogs(object $dialogsVk, string $token)
    {
      $dialogs = array();
      $messageIds = '';

      foreach ($dialogsVk->items as $i=>$dialog)
      {
        $dialogs[$i] = $this->dialogIdNamePhotoMembers($dialog, $dialogsVk);

        $messageIds .= $dialog->last_message_id.',';
      }

      $dialogs = $this->mapMessages($dialogs, $messageIds, $token);

      return $dialogs;
    }

    /**
     * Map dialogs and messages
     *
     * @param  array $dialogs
     * @param  string $messageIds
     * @param  string $token
     * @return array $dialogs
     */
    public function mapMessages(array $dialogs, string $messageIds, string $token)
    {
      $messages = json_decode(file_get_contents(
        'https://api.vk.com/method/execute.messageById?message_ids='.$messageIds.'&access_token='.$messenger->token.'&v=5.92'
      ))->response->items;

      foreach ($messages as $i=>$message)
      {
        if (strlen($message->text) > 40)
        {
          $message->text = mb_substr($message->text, 0, 40, 'UTF-8').'...';
        }
        $dialogs[$i]['last_message'] = array(
          'text' => $message->text,
          'timestamp' => $message->date.'000',
          'with_attachments' => count($message->attachments) > 0,
        );
      }

      return $dialogs;
    }

    /**
     * Get dialog name, photo and members count
     *
     * @param object $dialog
     * @param object $dialogsVk
     * @return string
     */
    public function dialogIdNamePhotoMembers(object $dialog, object $dialogsVk)
    {
      if ($dialog->peer->type === 'user')
      {
        foreach ($dialogsVk->profiles as $profile)
        {
          if ($profile->id === $dialog->peer->id) break;
        }

        $name = $profile->first_name.' '.$profile->last_name;
        $photo = $profile->photo_100;
        $membersCount = 2;
      }
      else
      {
        $name = $dialog->chat_settings->title;
        $photo = property_exists($dialog->chat_settings, 'photo') ?
          $dialog->chat_settings->photo->photo_100 :
          'https://vk.com/images/camera_100.png';
        $membersCount = $dialog->chat_settings->members_count;
      }

      return array(
        'dialog_id' => $dialog->peer->id,
        'name' => $name,
        'photo' => $photo,
        'members_count' => $membersCount,
      );
    }

    /**
     * Display messages for the specified dialog.
     *
     * @param  \App\Dialog $dialog
     * @return \Illuminate\Http\Response
     */
    public function getMessages(Dialog $dialog)
    {
      $dialog->unread_count = 0;
      $dialog->subscribed = true;
      $dialog->save();

      return response()->json([
        'success' => true,
        'dialogName' => $dialog->name,
        'double' => $dialog->members_count === 2,
        'messages' => $dialog->messages()->sortBy('timestamp')->values(),
      ]);
    }

    public function unsubscribe(Dialog $dialog)
    {
      $dialog->subscribed = false;
      $dialog->save();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function edit(Dialog $dialog)
    {
        //
    }

    /**
     * Connect vk dialog
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function connectVkDialog(Request $request)
    {
      $redirect_uri = $request->root().'/app/settings/messenger/vk';
      $code = $request->code;

      $result = file_get_contents(
        'https://oauth.vk.com/access_token?client_id=6995405&client_secret=EMBAaQ5AazBzEYb8HroZ&redirect_uri='.
        $redirect_uri.'&code='.$code
      );

      $q = explode(':', explode(',', $result)[1]);
      $dialogId = substr($q[0], -10, 9);
      $user = $request->user();
      $vk = $user->vk();
      $callbackUrl = $request->root().
        '/api/v1/messages/vk?api_token='.$user->api_token;
      $token = substr($q[1], 1, 85);

      $dialog = Dialog::where([
        ['dialog_id', $dialogId],
        ['messenger_id', $vk->id]
      ])->first();

      $conf = json_decode(file_get_contents(
        'https://api.vk.com/method/groups.getCallbackConfirmationCode?group_id='.
        $dialogId.'&access_token='.$token.'&v=5.95'
      ))->response->code;

      $dialog->code = $conf;
      $dialog->save();

      $serverId = json_decode(file_get_contents(
        'https://api.vk.com/method/groups.addCallbackServer?group_id='.
        $dialogId.'&url='.$callbackUrl.'&title=kit&access_token='.
        $token.'&v=5.95'
      ))->response->server_id;

      file_get_contents(
        'https://api.vk.com/method/groups.setCallbackSettings?group_id='.
        $dialogId.'&server_id='.$serverId.
        '&api_version=5.95&message_new=1&message_reply=1&access_token='.
        $token.'&v=5.95'
      );

      $author = Author::create([
        'author_id' => '-'.$dialog->dialog_id,
        'first_name' => $dialog->name,
        'last_name' => '',
        'avatar' => $dialog->photo,
      ]);

      if (DB::table('author_dialog')->where([
        'dialog_id' => $dialog->id,
        'author_id' => $author->id,
      ])->count() === 0)
      {
        DB::table('author_dialog')->insert([
          'dialog_id' => $dialog->id,
          'author_id' => $author->id,
        ]);
      }

      $dialog->token = $token;
      $dialog->server_id = $serverId;
      $dialog->updating = true;
      $dialog->save();

      return response()->json([
        'success' => true,
        'dialog' => $dialog->id
      ]);
    }

    /**
     * toggle updating of the specified resource in storage.
     *
     * @param  \App\Dialog $dialog
     * @return \Illuminate\Http\Response
     */
    public function toggleUpdating(Dialog $dialog)
    {
        $dialog->updating = !$dialog->updating;
        $dialog->save();

        return response()->json([
          'success' => true
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function deleteDialog(Dialog $dialog)
    {
      $dialog->authors()->each(function(Author $author) {
        if (count($author->dialogs()) === 1) {
          $author->delete();
        }
      });

      $dialog->delete();

      return response()->json([
        'success' => true,
      ]);
    }
}
