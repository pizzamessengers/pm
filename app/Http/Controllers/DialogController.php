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
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    private function addVk(Request $request)
    {
      $messenger = $request->user()->vk();

      $vk = new VKApiClient();
      $token = $messenger->token;

      $vkReq = $vk->messages()->searchConversations($token, array(
        'q' => $request->req,
      ));

      if (($count = $vkReq['count']) !== 1)
      {
        return $this->notTheOnly($count);
      }

      $dialog = $vkReq['items'][0];

      if (Dialog::where('dialog_id', $dialog['peer']['id'])
        ->where('messenger_id', $request->user()->vk()->id)->count() !== 0)
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

      $name = ($dialog['peer']['type'] === 'chat') ?
        $dialog['chat_settings']['title'] :
        ($profiles[0]['id'] === $dialog['peer']['id'] ?
          $profiles[0]['first_name'].' '.$profiles[0]['last_name'] :
          $profiles[1]['first_name'].' '.$profiles[1]['last_name']);

      $dialogData = array(
        'name' => $name,
        'messenger_id' => $messenger->id,
        'dialog_id' => (string) $dialog['peer']['id']
      );

      $dialog = Dialog::create($dialogData);

      StoreAuthors::dispatch('vk', $profiles, $dialog->id);

      return array(
        'success' => true,
        'dialog' => [
          'name' => $name,
          'id' => $dialog->id,
        ]
      );
    }

    /**
     * Create inst dialog.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    private function addInst(Request $request)
    {
      $messenger = $request->user()->inst();

      $inst = new Instagram(false, false);
      try {
          $inst->login($messenger->login, $messenger->password);
      } catch (\Exception $e) {
          info('Something went wrong: '.$e->getMessage());
          exit(0);
      }
      $users = explode(',', $request->req);
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
      info($profiles);

      $dialog = Dialog::create([
        'name' => $thread->getThreadTitle(),
        'messenger_id' => $messenger->id,
        'dialog_id' => $thread->getThreadId(),
        'last_message_id' => $thread->getLastPermanentItem()->getItemId(),
      ]);
      StoreAuthors::dispatch('inst', $profiles, $dialog->id);

      return array(
        'success' => true,
        'dialog' => [
          'name' => $thread->getThreadTitle(),
          'id' => $dialog->id,
        ]
      );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDialog(Request $request)
    {
      switch ($request->mess) {
        case 'vk':
          $result = $this->addVk($request);
          break;
        case 'inst':
          $result = $this->addInst($request);
          break;
        case 'wapp':
          $result = $this->addWapp($request);
          break;
      }

      return response()->json($result, 200);
    }

    private function notTheOnly(Int $count)
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
        return array(
          'success' => false,
          'message' => 'у вас несколько диалогов с таким или похожим названием',
        );
      }
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
        'messages' => $dialog->messages(),
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
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function toggleUpdating(Request $request, Dialog $dialog)
    {
        $dialog->updating = $request->updating;
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
