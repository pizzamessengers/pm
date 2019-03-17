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
    public function createMessage(Request $request)
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
      if ($messenger->updating === false) return;
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
        'timestamp' => $message['time'],
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

    /**
     * Send message to the messenger.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function sendMessage(Request $request)
    {
      $dialogId = Dialog::find($request->dialogId)->dialog_id;
      $text = $request->text;

      switch ($request->mess) {
        case 'vk':
          $vk = $request->user()->vk();
          $this->sendVkMessage($vk, $dialogId, $text);
          break;

        case 'inst':
          $inst = $request->user()->inst();
          $this->sendInstMessage($inst, $dialogId, $text);
          break;

        case 'wapp':
          $wapp = $request->user()->wapp();
          $this->sendWappMessage($wapp, $dialogId, $text);
          break;
      }

      return response()->json([
        'success' => true,
      ], 200);
    }

    /**
     * Send message to the vk.
     *
     * @param Messenger $messenger
     * @param string $dialogId
     * @param string $text
     * @return \Illuminate\Http\Response
     */
    private function sendVkMessage(Messenger $messenger, string $dialogId, string $text)
    {
      //
    }

    /**
     * Send message to the inst.
     *
     * @param Messenger $messenger
     * @param string $dialogId
     * @param string $text
     * @return \Illuminate\Http\Response
     */
    private function sendInstMessage(Messenger $messenger, string $dialogId, string $text)
    {
      $inst = new Instagram(false, false);

      try {
          $inst->login($messenger->login, $messenger->password);
      } catch (\Exception $e) {
          info('Something went wrong: '.$e->getMessage());
          exit(0);
      }

      $inst->direct->sendText(
        array('thread' => $dialogId),
        $ext
      );
    }

    /**
     * Send message to the wapp.
     *
     * @param Messenger $messenger
     * @param string $dialogId
     * @param string $text
     * @return \Illuminate\Http\Response
     */
    private function sendWappMessage(Messenger $messenger, string $dialogId, string $text)
    {
      $phone = substr($dialogId, 0, strlen($dialogId)-5);

      $url = $messenger->url.'message?token='.$messenger->token;
      $data = json_encode([
        'phone' => $phone,
        'body' => $text,
      ]);
      $options = stream_context_create(['https' => [
        'method'  => 'POST',
        'header'  => 'Content-type: application/json',
        'content' => $data
      ]]);
      file_get_contents($url, false, $options);
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
