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
     * Store a new messages from whatsapp webhook.
     *
     * @return \Illuminate\Http\Response
     */
    public function wapp()
    {
      $data = json_decode(file_get_contents('php://input'), true);
      $messenger = Messenger::where('instance', $data['instanceId'])->first();
      if ($messenger->updating === false) break;
      $watching = $messenger->watching;

      foreach($data['messages'] as $message)
      {
        if ($watching !== Messenger::where('instance', $data['instanceId'])->first()->watching) break;

        if (($dialog = Dialog::where([
          ['dialog_id', $message['chatId']],
          ['messenger_id', $messenger->id]
        ])->first()) === null)
        {
          if ($watching === 'dialogs') continue;
        }
        else if ($dialog->updating === false) continue;

        $this->addMessage($message, $messenger);
      }
    }

    /**
     * Get dialog id if exist or create new dialog.
     *
     * @param array $message
     * @param Messenger $messenger
     */
    private function addMessage(array $message, Messenger $messenger)
    {
      if ($message['type'] === 'chat')
      {
        $text = $message['body'];
      }
      else
      {
        $text = $message['caption'] !== null ? $message['caption'] : '';
      }

      $id = explode('_', $message->id)['2'];
      $dialogId = $this->dialogId($message['chatId'], $messenger);
      $authorId = $this->authorId($message['author'], $dialogId);

      $newMessage = Message::create([
        'message_id' => $id,
        'dialog_id' => $dialogId,
        'text' => $text,
        'author_id' => $authorId,
        'from_me' => $message['fromMe'],
      ]);

      if ($message->type !== 'chat')
      {
        $this->attachments($message, $newMessage->id);
      }
    }

    /**
     * Get dialog id if exist or create new dialog.
     *
     * @param string $dialogId
     * @param Messenger $messenger
     * @return int dialog id $dialogId
     */
    private function dialogId(string $dialogId, Messenger $messenger)
    {
      $dialog = Dialog::firstOrCreate([
        'messenger_id' => $messenger->id,
        'dialog_id' => (string) $dialogId,
        'name' => substr($dialogId, 0, strlen($dialogId)-5),
      ]);

      // TODO: если в разных мессенджерах будут совпадать id разных диалогов, то сделать доп. проверку

      return $dialog->id;
    }

    /**
     * Get author id if exist or create new author.
     *
     * @param int $userId
     * @param int $dialogId
     * @param Instagram $inst
     * @return int authorId
     */
    private function authorId(int $userId, int $dialogId)
    {
      $authorId = Author::where(
        'author_id',
        $userId
      )->value('id');

      /*if (count($author_ids) > 1) {
        // TODO: если в разных мессенджерах будут совпадать id разных авторов, то сделать доп. проверку
      }
      else */
      if ($authorId === null)
      {
        $profile = $inst->people->getInfoById($userId)->getUser();
        $name = explode(' ', $profile->getFullName());
        $firstName = $name[0];
        $lastName = $name[1];

        $authorId = Author::create([
          'author_id' => $userId,
          'first_name' => $firstName,
          'last_name' => $lastName,
          'avatar' => $profile->getProfilePicUrl(),
        ])->id;
      }

      if (DB::table('author_dialog')->where([
        'dialog_id' => $dialogId,
        'author_id' => $authorId,
      ])->count() === 0)
      {
        DB::table('author_dialog')->insert([
          'dialog_id' => $dialogId,
          'author_id' => $authorId,
        ]);
      }

      return $authorId;
    }

    /**
     * Create attachment instance.
     *
     * @param object type of attachment $type
     * @param int $messageId
     * @param Messenger $messenger
     * @param VKApiClient $vk
     */
    private function attachments(object $message, int $messageId)
    {
        Attachment::create([
          'type' => $message->type,
          'message_id' => $messageId,
          'url' => $message->body,
        ]);
      }
    }

    /**
     * Send message to the messenger and store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendMessage(Request $request)
    {
      switch ($request->messenger) {
        case 'vk':

          break;
        case 'inst':
          /*$ig = new Instagram(false, false);

          try {
              $ig->login('ilya_dmitriev1234', '1qazxsw23edc');
          } catch (\Exception $e) {
              info('Something went wrong: '.$e->getMessage());
              exit(0);
          }*/
          break;
        case 'wapp':
          $wapp = $request->user()->wapp();
          $dialogId = $request->dialogId;
          $phone = substr($dialogId, 0, strlen($dialogId)-5);

          $url = $wapp->url.'message?token='.$wapp->token;
          $data = json_encode([
            'phone' => $phone,
            'body' => $request->text,
          ]);
          $options = stream_context_create(['https' => [
            'method'  => 'POST',
            'header'  => 'Content-type: application/json',
            'content' => $data
          ]]);
          file_get_contents($url, false, $options);
          break;
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
      */
      return response()->json([
        'success' => true,
        'message' => 'kek',
      ], 200);
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
