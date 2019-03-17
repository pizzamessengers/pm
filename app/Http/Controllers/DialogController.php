<?php

namespace App\Http\Controllers;

use DB;
use App\Author;
use App\Dialog;
use App\Messenger;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use App\Jobs\StoreAuthors;
use InstagramAPI\Instagram;
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
     * @param array $dialogs
     * @param Messenger $messenger
     * @param VKApiClient $vk
     * @param string $token
     * @param bool $afterQuery
     * @return \Illuminate\Http\Response
     */
    private function addDialogsVk(array $dialogs, Messenger $messenger, VKApiClient $vk, string $token, bool $afterQuery)
    {
      $dialogList = array();

      if ($afterQuery)
      {
        $dialog = $dialogs['items'][0];
        if (Dialog::where([
          ['dialog_id', $dialog['peer']['id']],
          ['messenger_id', $messenger->id]
        ])->first() !== null)
        {
          return array(
            'success' => false,
            'message' => 'Диалог уже добавлен',
          );
        }

        $profiles = $vk->messages()->getConversationMembers($token, array(
          'peer_id' => $dialog['peer']['id'],
          'fields' => 'photo_100',
        ))['profiles'];

        $dialogData = $this->dialogIdNamePhotoMembers($dialog, $dialogs);

        $lastMessage = $vk->messages()->getById($token, array(
          'message_ids' => $dialog['last_message_id'],
        ))['items'][0];

        $lastMessageText = $lastMessage['text'];
        if (strlen($lastMessageText) > 40)
        {
          $lastMessageText = mb_substr($lastMessageText, 0, 40, 'UTF-8').'...';
        }

        $dialog = Dialog::create([
          'name' => $dialogData['name'],
          'messenger_id' => $messenger->id,
          'dialog_id' => (string) $dialog['peer']['id'],
          'last_message' => array(
            'text' => $lastMessageText,
            'timestamp' =>  $lastMessage['date']
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
              'message' => 'Диалог уже добавлен',
            );
          }

          $profiles = $vk->messages()->getConversationMembers($token, array(
            'peer_id' => $dialog['dialog_id'],
            'fields' => 'photo_100',
          ))['profiles'];

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
            'message' => 'пользователь '.$user.' не найден'
          );
        }
        array_push($userIds, $userId);
      }

      $thread = $inst->direct->getThreadByParticipants($userIds)->getThread();

      if (!$thread)
      {
        return array(
          'success' => false,
          'message' => 'диалог с этими пользователями не найден'
        );
      }

      if (Dialog::where('dialog_id', $thread->getThreadId())
        ->where('messenger_id', $request->user()->inst()->id)->count() !== 0)
      {
        return array(
          'success' => false,
          'message' => 'Диалог уже добавлен',
        );
      }

      $profiles = $thread->getUsers();

      $lastMessageText = $thread->getLastPermanentItem()->getText();
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
        'last_message' => json_encode([
          'id' => $thread->getLastPermanentItem()->getItemId(),
          'text' => $lastMessageText,
          'timestamp' => $thread->getLastPermanentItem()->getTimestamp(),
        ]),
        'members_count' => count($thread->getUsers()) + 1,
        'photo' => $photo,
        'unread_count' => 0,
      ]);
      StoreAuthors::dispatch('inst', $profiles, $dialog->id);

      $dialog->last_message = json_decode($dialog->last_message);
      $dialogList[] = $dialog;

      return array(
        'success' => true,
        'dialogList' => $dialogList
      );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $query
     * @param Messenger $messenger
     * @param VKApiClient $vk
     * @param string $token
     * @return \Illuminate\Http\Response
     */
    public function processQueryVk(string $q, Messenger $messenger, VKApiClient $vk, string $token)
    {
      $vkRes = $vk->messages()->searchConversations($token, array(
        'q' => $q,
        'extended' => 1,
        'fields' => 'photo_100',
        'count' => 50,
      ));

      if (($count = $vkRes['count']) !== 1)
      {
        return $this->notTheOnly($count, $vkRes, $vk, $token);
      }

      return $this->addDialogsVk($vkRes, $messenger, $vk, $token, true);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDialogs(Request $request)
    {
      switch ($request->mess) {
        case 'vk':
          $messenger = $request->user()->vk();

          $vk = new VKApiClient();
          $token = $messenger->token;

          $result = $request->q ?
            $this->processQueryVk($request->q, $messenger, $vk, $token) :
            $this->addDialogsVk($request->dialogs, $messenger, $vk, $token, false);
          break;
        case 'inst':
          $result = $this->addDialogsInst($request);
          break;
        case 'wapp':
          $result = $this->addWapp($request);
          break;
      }

      return response()->json($result, 200);
    }

    /**
     * if count of dialogs more or less than 1
     *
     * @param  int $count
     * @param  array $dialogsVk
     * @param  VKApiClient $vk
     * @param  string $token
     * @return array response data
     */
    private function notTheOnly(int $count, array $dialogsVk, VKApiClient $vk, string $token)
    {
      if ($count === 0)
      {
        return array(
          'success' => false,
          'message' => 'нет диалога с похожим названием',
        );
      }
      else if ($count > 1)
      {
        $dialogs = $this->dialogs($dialogsVk, $vk, $token);

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
     * @param  array $dialogsVk
     * @param  VKApiClient $vk
     * @param  string $token
     * @return array $dialogs
     */
    public function dialogs(array $dialogsVk, VKApiClient $vk, string $token)
    {
      $dialogs = array();
      $messageIds = '';

      foreach ($dialogsVk['items'] as $i=>$dialog)
      {
        $dialogs[$i] = $this->dialogIdNamePhotoMembers($dialog, $dialogsVk);

        $messageIds .= $dialog['last_message_id'].',';
      }

      $dialogs = $this->mapMessages($dialogs, $messageIds, $vk, $token);

      return $dialogs;
    }

    /**
     * Map dialogs and messages
     *
     * @param  array $dialogs
     * @param  string $messageIds
     * @param  VKApiClient $vk
     * @param  string $token
     * @return array $dialogs
     */
    public function mapMessages(array $dialogs, string $messageIds, VKApiClient $vk, string $token)
    {
      $messages = $vk->messages()->getById($token, array(
        'message_ids' => $messageIds,
      ))['items'];

      foreach ($messages as $i=>$message)
      {
        if (strlen($message['text']) > 40)
        {
          $message['text'] = mb_substr($message['text'], 0, 40, 'UTF-8').'...';
        }
        $dialogs[$i]['last_message'] = $message['text'];
      }

      return $dialogs;
    }

    /**
     * Get dialog name, photo and members count
     *
     * @param  array $dialog
     * @param  array $dialogsVk
     * @return string
     */
    public function dialogIdNamePhotoMembers(array $dialog, array $dialogsVk)
    {
      if ($dialog['peer']['type'] === 'user')
      {
        foreach ($dialogsVk['profiles'] as $profile)
        {
          if ($profile['id'] === $dialog['peer']['id']) break;
        }

        $name = $profile['first_name'].' '.$profile['last_name'];
        $photo = $profile['photo_100'];
        $membersCount = 2;
      }
      else
      {
        $name = $dialog['chat_settings']['title'];
        $photo = array_key_exists('photo', $dialog['chat_settings']) ?
          $dialog['chat_settings']['photo']['photo_100'] :
          'https://vk.com/images/camera_100.png';
        $membersCount = $dialog['chat_settings']['members_count'];
      }

      return array(
        'dialog_id' => $dialog['peer']['id'],
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
    public function show(Dialog $dialog)
    {
      return response()->json([
        'success' => true,
        'messages' => $dialog->messages()->sortBy('timestamp')->values(),
      ]);
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
     * toggle updating of the specified resource in storage.
     *
     * @param  \App\Dialog $dialog
     * @return \Illuminate\Http\Response
     */
    public function toggleUpdating(Dialog $dialog)
    {
        $dialog->updating = !$dialog->updating;
        $dialog->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function deleteDialog(Dialog $dialog)
    {
      $dialog->authors()->each(function($author) {
                          if (count($author->dialogs()) === 1)
                          {
                            $author->delete();
                          }
                        });

      $dialog->messages()->each(function($message) {
                            $message->delete();
                          });

      $dialog->delete();
      return response()->json([
        'success' => true,
      ]);
    }
}
