<?php

namespace App\Http\Controllers;

use App\Messenger;
use App\Dialog;
use App\Message;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use InstagramAPI\Instagram;

class MessengerController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
      public function addMessenger(Request $request)
      {
        $messengerData = [
          'name' => $request->name,
          'watching' => $request->watching,
          'user_id' => $request->user()->id,
        ];

        switch ($request->name) {
          case 'vk':
            $messengerData['token'] = $request->props['token'];
            $vk = new VKApiClient();
            $lpServer = $vk->messages()->getLongPollServer($messengerData['token'], array(
              'need_pts' => 1,
              'lp_version' => 3,
            ));
            $messengerData['lp'] = json_encode([
              'ts' => $lpServer['ts'],
              'pts' => $lpServer['pts'],
            ]);
            break;
          case 'inst':
            $messengerData['login'] = $request->props['login'];
            $messengerData['password'] = $request->props['password'];
            break;
          case 'wapp':
            // code...
            break;
        }

        $messenger = Messenger::create($messengerData);

/*        if ($request->name === 'inst' && $messengerData['watching'] === 'all')
        {
          $inst = new Instagram(false, false);
          try {
              $inst->login($messengerData['login'], $messengerData['password']);
          } catch (\Exception $e) {
              info('Something went wrong: '.$e->getMessage());
              exit(0);
          }

          $lastThread = $inst->direct->getInbox()->getInbox()->getThreads()[0];
          Dialog::create([
            'messenger_id' => $messenger->id,
            'dialog_id' => $lastThread->getThreadId(),
            'name' => $lastThread->getThreadTitle(),
            'last_message_id' => $lastThread->getLastPermanentItem()->getItemId(),
          ]);
        }*/

        return response()->json([
          'success' => true,
          'messenger' => [
            'id' => $messenger->id
          ]
        ], 200);
      }

    /**
     * Display the messages for the specified messenger.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function showMessages(Messenger $messenger)
    {
        return response()->json([
          'success' => true,
          'messages' => $messenger->messages()
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function edit(Messenger $messenger)
    {
        //
    }

    /**
     * Toggle watching the specified resource in storage.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function toggleWatching(Messenger $messenger)
    {
      if ($messenger->watching === 'dialogs')
      {
        $messenger->dialogs()->get()->each(
          function(Dialog $dialog)
          {
            $dialog->updating = false;
            $dialog->save();
          }
        );

        $messenger->watching = 'all';
        $messenger->save();
      }
      else
      {
        $messenger->dialogs()->get()->each(
          function(Dialog $dialog)
          {
            /*$dialog-messages()->each(function(Message $message) {
              $message->delete();
            });*/
            $dialog->delete();
          }
        );

        $messenger->watching = 'dialogs';
        $messenger->save();
      }

      return response()->json([
        'success' => true,
      ], 200);;
    }

    /**
     * Toggle updating the specified resource in storage.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function toggleUpdating(Messenger $messenger)
    {
      $messenger->updating = !$messenger->updating;
      $messenger->save();

      return response()->json([
        'success' => true,
      ], 200);;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function deleteMessenger(Request $request)
    {
        $messenger = $request->user()->{$request['name']}()->delete();

        return response()->json([
          'success' => true,
        ]);
    }
}
