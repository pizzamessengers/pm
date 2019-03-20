<?php

namespace App\Http\Controllers;

use App\Messenger;
use App\Dialog;
use App\Message;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use InstagramAPI\Instagram;
use InstagramAPI\Exception\InvalidUserException;
use InstagramAPI\Exception\IncorrectPasswordException;
use InstagramAPI\Exception\InvalidArgumentException;
use InstagramAPI\Exception\ForcedPasswordResetException;

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

        $response = array(
          'success' => true,
        );

        switch ($request->name) {
          case 'vk':
            $messengerData['token'] = $request->props['token'];
            $vk = new VKApiClient();
            $lpServer = $vk->messages()->getLongPollServer($messengerData['token'], array(
              'need_pts' => 1,
              'lp_version' => 3,
            ));
            $messengerData['lp'] = array(
              'ts' => $lpServer['ts'],
              'pts' => $lpServer['pts'],
            );

            if ($messengerData['watching'] === 'dialogs')
            {
              $vkRes = $vk->messages()->getConversations($messengerData['token'], array(
                'count' => 20,
                'extended' => 1,
                'fields' => 'photo_100',
              ));

              $profiles = $vkRes['profiles'];

              foreach ($vkRes['items'] as $item) {
                $dialog = $item['conversation'];
                $lastMessage = $item['last_message'];

                $lastMessageText = strlen($lastMessage['text']) > 40 ?
                  mb_substr($lastMessage['text'], 0, 40, 'UTF-8').'...' :
                  $lastMessage['text'];

                $data = array();
                if ($dialog['peer']['type'] === 'chat')
                {
                  $settings = $dialog['chat_settings'];

                  $data['name'] = $settings['title'];
                  $data['photo'] = array_key_exists('photo', $settings) ?
                    $settings['photo']['photo_100'] :
                    'https://vk.com/images/camera_100.png';
                  $data['members_count'] = $settings['members_count'];
                }
                else
                {
                  foreach ($profiles as $profile) {
                    if ($profile['id'] === $dialog['peer']['id']) break;
                  }

                  $data['name'] = $profile['first_name'].' '.$profile['last_name'];
                  $data['photo'] = $profile['photo_100'];
                  $data['members_count'] = 2;
                }

                array_push($dialogs, array(
                  'id' => $dialog['peer']['id'],
                  'name' => $data['name'],
                  'photo' => $data['photo'],
                  'last_message' => array(
                    'text' => $lastMessageText,
                    'timestamp' => $lastMessage['date'] + '000',
                  ),
                  'members_count' => $data['members_count'],
                ));

                $response += array('dialogs' => $dialogs);
              }
            }

            break;
          case 'inst':
            $login = $request->props['login'];
            $password = $request->props['password'];

            $inst = new Instagram(false, false);
            try {
                $inst->login($login, $password);
            } catch (\Exception $e) {
                if ($e instanceof InvalidArgumentException)
                {
                  $message = 'Проверьте логин и пароль';
                }
                elseif ($e instanceof InvalidUserException)
                {
                  $message = 'Такого пользователя не существует :(';
                }
                elseif ($e instanceof IncorrectPasswordException || $e instanceof ForcedPasswordResetException)
                {
                  $message = 'Неправильный пароль';
                }
                else
                {
                  $message = 'Что-то пошло не так';
                }

                $response['success'] = false;
                $response += array('message' => $message);

                return response()->json($response, 200);
            }

            $messengerData['login'] = $login;
            $messengerData['password'] = $password;

            if ($messengerData['watching'] === 'dialogs')
            {
              // TODO:
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
              // TODO:
            }

            break;
        }

        $messenger = Messenger::create($messengerData);

        $response += array('messengerId' => $messenger->id);

        return response()->json($response, 200);
      }

    /**
     * Display the dialogs for the specified messenger.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function getDialogsSortedByLastMessageTimestamp(Messenger $messenger)
    {
        return response()->json([
          'success' => true,
          'dialogs' => $messenger->getDialogsWithLastMessageTimestamp()->sortByDesc('last_message_timestamp')->values(),
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
        $messenger = $request->user()->{$request->name}();
        $messenger->dialogs()->get()->each(function($dialog)
        {
          $dialog->authors()->each(function($author)
          {
            if (count($author->dialogs()) === 1)
            {
              $author->delete();
            }
          });

          $dialog->delete();
        });

        $messenger->delete();

        return response()->json([
          'success' => true,
        ]);
    }
}
