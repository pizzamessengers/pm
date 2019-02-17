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

        $dialogs = array();

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

            if ($messengerData['watching'] === 'dialogs')
            {
              $vkRes = $vk->messages()->getConversations($messengerData['token'], array(
                'count' => 20,
              ));

              foreach ($vkRes['items'] as $item) {
                $dialog = $item['conversation'];
                $lastMessage = $item['last_message'];
                $type = $dialog['peer']['type'];

                $text = strlen($lastMessage['text']) > 40 ?
                  mb_substr($lastMessage['text'], 0, 40, 'UTF-8').'...' :
                  $lastMessage['text'];

                array_push($dialogs, array(
                  'id' => $dialog['peer']['id'],
                  'type' => $type,
                  'title' => $type === 'chat' ?
                    $dialog['chat_settings']['title'] :
                    'kekkek',
                  'photo' => $type === 'chat' ?
                    array_key_exists('photo', $dialog['chat_settings']) ?
                      $dialog['chat_settings']['photo']['photo_100'] :
                      'https://vk.com/images/camera_100.png?ava=1' :
                    'https://www.google.ru/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=2ahUKEwie5oWcobrgAhWQuIsKHcw2DmIQjRx6BAgBEAU&url=https%3A%2F%2Fwww.istockphoto.com%2Fae%2Fphotos%2Fpizza&psig=AOvVaw0RgFJ_8NAdfqZuHVNMqnKw&ust=1550200552098469',
                  'last_message' => $text,
                  'members_count' => $type === 'chat' ?
                    $dialog['chat_settings']['members_count'] :
                    2
                ));
              }
            }

            break;
          case 'inst':
            $messengerData['login'] = $request->props['login'];
            $messengerData['password'] = $request->props['password'];

            if ($messengerData['watching'] === 'dialogs')
            {

            }

            break;
          case 'wapp':
            $messengerData['token'] = $request->props['token'];
            $messengerData['url'] = $request->props['url'];
            $messengerData['instance'] = substr($messengerData['url'], -6, 5);

            $url = $messengerData['url'].'webhook?token='.$messengerData['token'];
            $data = json_encode([
              'webhookUrl' => 'http://localhost:8000/messages/wapp',
            ]);
            $options = stream_context_create(['https' => [
              'method'  => 'POST',
              'header'  => 'Content-type: application/json',
              'content' => $data
            ]]);
            file_get_contents($url, false, $options);

            if ($messengerData['watching'] === 'dialogs')
            {

            }

            break;
        }

        $messenger = Messenger::create($messengerData);

        info($dialogs);

        return $messengerData['watching'] === 'all' ?
          response()->json([
            'success' => true,
            'messenger' => [
              'id' => $messenger->id
            ]
          ], 200) :
          response()->json([
            'success' => true,
            'messenger' => [
              'id' => $messenger->id
            ],
            'dialogs' => $dialogs,
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
