<?php

namespace App\Http\Controllers;

use App\Messenger;
use App\Dialog;
use App\Message;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;

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
        $messengerData = $request->all();

        $vk = new VKApiClient();
        $lpServer = $vk->messages()->getLongPollServer($messengerData['token'], array(
          'need_pts' => 1,
          'lp_version' => 3,
        ));

        $messengerData['user_id'] = $request->user()->id;
        $messengerData['lp'] = json_encode([
          'ts' => $lpServer['ts'],
          'pts' => $lpServer['pts'],
        ]);

        $messenger = Messenger::create($messengerData);

        return response()->json([
          'success' => true,
          'messenger' => [
            'id' => $messenger->id,
            'watching' => $messenger->watching
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
        ], 200);;
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
     * toggling watching the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function toggleWatching(Request $request, Messenger $messenger)
    {
      if ($request->watching === 'all')
      {
        $messenger->dialogs()->get()->each(
          function(Dialog $dialog)
          {
            $dialog->updating = false;
            $dialog->save();
          }
        );
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
      }

      $messenger->watching = $request->watching;
      $messenger->save();
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
