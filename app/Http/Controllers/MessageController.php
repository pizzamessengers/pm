<?php

namespace App\Http\Controllers;

use App\Message;
use App\Dialog;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use InstagramAPI\Instagram;
use InstagramAPI\Response\DirectInboxResponse;

class MessageController extends Controller
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addMessage(Request $request)
    {
      $message = Message::create($request->all());
    }

    /**
     * Send message to the messenger and store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendMessage(Request $request)
    {
      $ig = new Instagram(false, false);

      try {
          $ig->login('ilya_dmitriev1234', '1qazxsw23edc');
      } catch (\Exception $e) {
          info('Something went wrong: '.$e->getMessage());
          exit(0);
      }

      /*try {
          $direct = $ig->direct;
          $response = $direct->getThread('340282366841710300949128293298591275091');
          //info($response->getThread()->getItems());
            // In this example we're simply printing the IDs of this page's items.
          foreach ($response->getThread()->getItems() as $item) {
              info($item->getUserId() . '  ' . $item->getText());
          }
      } catch (\Exception $e) {
          echo 'Something went wrong: '.$e->getMessage()."\n";
      }*/

      /*$inbox = $ig->direct->getInbox();

      info($inbox);*/

      //$direct->sendText(['users' => [6186894050]], 'kek');

      /*info('here');
      $vk = new VKApiClient();

      return $vk->messages()->send($request->user()->vk()->token, array(
        'random_id' => random_int(1000000000, 2000000000),
        'peer_id' => $request->dialogId,
        'message' => $request->text,
        //'attachment' => ,
        //'forward_messages' => ,
        //'sticker_id' => ,
      ));

      info($response);

      return response()->json([
        'success' => true,
        'message' => 'kek',
      ], 200);*/
    }

    /**
     * Display messages.
     *
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function show(Message $message)
    {
      //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Message  $message
     * @return \Illuminate\Http\Response
     */
    public function destroy(Message $message)
    {
        //
    }
}
