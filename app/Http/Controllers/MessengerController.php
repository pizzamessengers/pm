<?php

namespace App\Http\Controllers;

use Validator;
use Artisan;
use Illuminate\Validation\Rule;
use App\Messenger;
use App\Author;
use App\Dialog;
use App\Message;
use Illuminate\Http\Request;
use InstagramAPI\Instagram;
use VK\Client\VKApiClient;
use VK\OAuth\VKOAuth;
use \telegramBot;
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
        $user = $request->user();
        $name = $request->name;

        if ($user->$name() !== null)
          return response()->json(['success' => false]);

        if (Validator::make($request->all(), [
          'name' => [
            'required',
            Rule::in(['vk', 'inst', 'wapp', 'tlgrm']),
          ],
          'watching' => [
            'required',
            Rule::in(['all', 'dialogs']),
          ],
          'importValue' => [
            'min:0',
            'max:20'
          ],
        ])->fails()) {
          return response()->json([
            'success' => false,
            'message' => 'all.error.hack',
          ]);
        };

        $messengerData = [
          'name' => $name,
          'watching' => $request->watching,
          'user_id' => $user->id,
        ];

        $dialogs = array();

        $response = array(
          'success' => true,
        );

        switch ($name) {
          case 'vk':
            if (Validator::make($request->all(), [
              'props.code' => [
                'required'
              ]
            ])->fails()) {
              return response()->json([
                'success' => false,
                'message' => 'error.smth',
              ]);
            };

            $redirect_uri = $request->root().'/app/socials/vk';
            $code = $request->props['code'];

            $messengerData['token'] = json_decode(file_get_contents(
              'https://oauth.vk.com/access_token?client_id=6995405&client_secret=EMBAaQ5AazBzEYb8HroZ&redirect_uri='.
              $redirect_uri.'&code='.$code
            ))->access_token;

           /*if ($messengerData['watching'] === 'dialogs')
           {
             $profiles = $lp->conversations->profiles;
             foreach ($lp->conversations->items as $item) {
               $dialog = $item->conversation;
               $lastMessage = $item->last_message;

               $lastMessageText = strlen($lastMessage->text) > 40 ?
                 mb_substr($lastMessage->text, 0, 40, 'UTF-8').'...' :
                 $lastMessage->text;

               $data = array();
               if ($dialog->peer->type === 'chat')
               {
                 $settings = $dialog->chat_settings;

                 $data['name'] = $settings->title;
                 $data['photo'] = property_exists($settings, 'photo') ?
                   $settings->photo->photo_100 :
                   'https://vk.com/images/camera_100.png';
                 $data['members_count'] = $settings->members_count;
               }
               else
               {
                 foreach ($profiles as $profile) {
                   if ($profile->id === $dialog->peer->id) break;
                 }

                 $data['name'] = $profile->first_name.' '.$profile->last_name;
                 $data['photo'] = $profile->photo_100;
                 $data['members_count'] = 2;
               }

               array_push($dialogs, array(
                 'dialog_id' => $dialog->peer->id,
                 'name' => $data['name'],
                 'photo' => $data['photo'],
                 'last_message' => array(
                   'text' => $lastMessageText,
                   'timestamp' => $lastMessage->date.'000',
                   'with_attachments' => count($lastMessage->attachments) > 0,
                 ),
                 'members_count' => $data['members_count'],
               ));
             }

             $response += array('dialogs' => $dialogs);
           }*/
           break;
          case 'inst':
            if (Validator::make($request->all(), [
              'props.login' => [
                'required'
              ],
              'props.password' => [
                'required'
              ],
            ])->fails()) {
              return response()->json([
                'success' => false,
                'message' => 'messenger.error.login-password',
              ]);
            };

            $login = $request->props['login'];
            $password = $request->props['password'];

            $inst = new Instagram(false, false);
            try {
                $inst->login($login, $password);
            } catch (\Exception $e) {
                if ($e instanceof InvalidArgumentException)
                {
                  $message = 'messenger.error.login-password';
                }
                elseif ($e instanceof InvalidUserException)
                {
                  $message = 'all.error.user.'.$login;
                }
                elseif ($e instanceof IncorrectPasswordException || $e instanceof ForcedPasswordResetException)
                {
                  $message = 'messenger.error.password';
                }
                else
                {
                  info($e);
                  $message = 'all.error.smth';
                }

                $response['success'] = false;
                $response['message'] = $message;

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
            if (Validator::make($request->all(), [
              'props.token' => [
                'required'
              ],
              'props.url' => [
                'required'
              ],
            ])->fails()) {
              return response()->json([
                'success' => false,
                'message' => 'messenger.error.login-url',
              ]);
            };

            $messengerData['token'] = $request->props['token'];
            $messengerData['url'] = $request->props['url'];
            $messengerData['instance'] = substr($messengerData['url'], -6, 5);

            $url = $messengerData['url'].'webhook?token='.$messengerData['token'];
            $token = $user->api_token;
            $data = json_encode([
              'webhookUrl' => $request->root().'/api/v1/messages/wapp?api_token='.$token,
            ]);
            $options = stream_context_create(['http' => [
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
          case 'tlgrm':
            if (Validator::make($request->all(), [
              'props.token' => [
                'required'
              ],
            ])->fails()) {
              return response()->json([
                'success' => false,
                'message' => 'messenger.error.token',
              ], 200);
            };

            $token = $request->props['token'];

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

            if ($messengerData['watching'] === 'dialogs')
            {
              // TODO:
            }

            break;
        }

        $messenger = Messenger::create($messengerData);

        if ($name === 'vk') {
          $groups = json_decode(file_get_contents(
            'https://api.vk.com/method/execute.getGroups?access_token='.
            $messengerData['token'].'&v=5.95'
          ))->response;

          foreach ($groups as $group) {
            if (!Dialog::where([
                ['dialog_id', $group->id],
                ['messenger_id', $messenger->id]
              ])->exists()) {

              $dialog = Dialog::create([
                'name' => $group->name,
                'messenger_id' => $messenger->id,
                'dialog_id' => $group->id,
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
            }
          }
        } else if ($name === 'tlgrm') {
          $dialog = Dialog::create([
            'name' => $name,
            'messenger_id' => $messenger->id,
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
        }

        if ($request->importValue > 0) {
          switch ($name) {
            case 'inst':
              Artisan::queue('getMessages:inst', array(
                'importDays' => $request->importValue
              ));
              break;
          }
        }

        $response['messengerId'] = $messenger->id;

        return response()->json($response, 200);
      }

      /**
       * Do request to wapp server for api account status
       *
       * @param  \App\Messenger  $messenger
       * @return \Illuminate\Http\Response
       */
      public function getStatusWapp(Request $request)
      {
        $response = json_decode(file_get_contents($request->url));

        return response()->json([
          'success' => true,
          'status' => $response->accountStatus
        ]);
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
     * Display the dialogs for the specified messenger.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function getSettingsDialogs(Messenger $messenger)
    {
        return response()->json([
          'success' => true,
          'dialogs' => $messenger->name === 'vk' ? $messenger->groups() : $messenger->dialogs(),
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
    public function toggleWatching(Messenger $messenger) {
      if ($messenger->watching === 'dialogs') {
        $messenger->dialogs()->get()->each(
          function(Dialog $dialog) {
            $dialog->updating = false;
            $dialog->save();
          }
        );

        $messenger->watching = 'all';
        $messenger->save();
      }
      else {
        $messenger->dialogs()->get()->each(
          function(Dialog $dialog) {
            $dialog->authors()->each(function(Author $author) {
              if (count($author->dialogs()) === 1) {
                $author->delete();
              }
            });

            $dialog->delete();
          }
        );

        $messenger->watching = 'dialogs';
        $messenger->save();
      }

      return response()->json([
        'success' => true,
      ], 200);
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
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function deleteMessenger(Request $request)
    {
        if (Validator::make($request->all(), [
          'name' => [
              'required',
              Rule::in(['vk', 'inst', 'wapp', 'tlgrm']),
          ],
        ])->fails()) {
          return response()->json([
            'success' => false,
            'message' => 'all.error.hack',
          ]);
        };

        $messenger = $request->user()->{$request->name}();
        $messenger->dialogs()->get()->each(function(Dialog $dialog)
        {
          $dialog->authors()->each(function(Author $author) {
            if (count($author->dialogs()) === 1) {
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
