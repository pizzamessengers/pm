<?php

namespace App\Http\Controllers;

use App\Message;
use App\Messenger;
use App\Dialog;
use App\Author;
use App\Attachment;
use App\Events\MessagesCreated;
use Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use InstagramAPI\Instagram;
use InstagramAPI\Response\DirectInboxResponse;
use UploadedFile;
use DB;

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
     * Processing whatsapp webhook.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function wapp(Request $request)
    {
      $messenger = Messenger::where('instance', $request->instanceId)->first();
      if ($messenger->updating === false) return;
      $watching = $messenger->watching;

      $messages = array();
      foreach($request->messages as $message)
      {
        // если watching поменяется во время выполнения запроса, то сообщения создавать не нужно
        if ($watching !== Messenger::where('instance', $request->instanceId)->first()->watching) break;

        if (($dialog = Dialog::where([
          ['dialog_id', $message['chatId']],
          ['messenger_id', $messenger->id]
        ])->first()) === null)
        {
          if ($watching === 'dialogs') continue;
        }
        else if ($dialog->updating === false) continue;

        // если диалог существует и updating true или messenger watching 'all'
        array_push($messages, $this->addMessage($message, $messenger));
      }

      event(new MessagesCreated($messages));
    }

    /**
     * Store a new messages from whatsapp webhook.
     *
     * @param array $message
     * @param Messenger $messenger
     * @return Message
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

      $id = explode('_', $message['id'])['2'];
      $dialogId = $this->dialogId($message, $text, $messenger);
      $authorId = $this->authorId($message['author'], $message['senderName'], $dialogId);

      $newMessage = Message::create([
        'message_id' => $id,
        'dialog_id' => $dialogId,
        'text' => $text,
        'author_id' => $authorId,
        'from_me' => $message['fromMe'],
        'timestamp' => $message['time'].'000',
      ]);

      if ($message['type'] !== 'chat')
      {
        $this->attachments($message, $newMessage->id);
      }

      return $newMessage;
    }

    /**
     * Get dialog id if exist or create new dialog.
     *
     * @param array $message
     * @param string $text
     * @param Messenger $messenger
     * @return int dialog id $dialogId
     */
    private function dialogId(array $message, string $text, Messenger $messenger)
    {
      if (($dialog = Dialog::where([
        ['messenger_id', $messenger->id],
        ['dialog_id', (string) $message['chatId']],
      ])->first()) === null)
      {
        $dialog = Dialog::create([
          'messenger_id' => $messenger->id,
          'dialog_id' => (string) $message['chatId'],
          'name' => $message['chatName'],
          'last_message' => array(
            'text' => $text,
            'timestamp' => $message['time'].'000',
            'with_attachments' => $message['type'] !== 'chat',
          ),
          'members_count' => 0,
          'photo' => 'https://vk.com/images/camera_100.png',
          'unread_count' => 0,
        ]);
      }
      else
      {
        $dialog->last_message = array(
          'text' => $text,
          'timestamp' => $message['time'].'000',
          'with_attachments' => $message['type'] !== 'chat',
        );
        $dialog->save();
      }

      return $dialog->id;
    }

    /**
     * Get author id if exist or create new author.
     *
     * @param string $userId
     * @param int $dialogId
     * @param string $name
     * @return int authorId
     */
    private function authorId(string $userId, string $name, int $dialogId)
    {
      $authors = Author::where(
        'author_id',
        $userId
      )->get();

      $authorId = null;

      if (count($authors) > 0) {
        foreach ($authors as $author) {
          if ($author->dialogs()[0]->messenger()->name === 'vk')
          {
            $authorId = $author->id;
            break;
          }
        }
      }

      if (empty($authorId))
      {
        $authorId = Author::create([
          'author_id' => $userId,
          'first_name' => $name,
          'last_name' => '',
          'avatar' => 'https://vk.com/images/camera_100.png',
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
      if (Validator::make($request->all(), [
        'dialogId' => [
          'required',
        ],
        /*'attacments' => [
          'required_without_all:text'
        ]*/
      ])->fails()) {
        return response()->json([
          'success' => false,
          'message' => 'all.error.hack',
        ]);
      };

      $dialog = Dialog::find($request->dialogId);
      $text = $request->text;
      $attachments = $request->attachments;

      switch ($request->mess) {
        case 'vk':
          $vk = $request->user()->vk();
          $this->sendVkMessage($vk, $dialog, $text, $attachments);
          break;

        case 'inst':
          $inst = $request->user()->inst();
          $this->sendInstMessage($inst, $dialog->dialog_id, $text, $attachments);
          break;

        case 'wapp':
          $this->sendWappMessage($request, $dialog, $text, $attachments);
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
     * @param Dialog $dialog
     * @param $text
     * @param array $attachments
     * @return \Illuminate\Http\Response
     */
    private function sendVkMessage(Messenger $messenger, Dialog $dialog, $text, array $attachments)
    {
      $photos = implode('|@|', $attachments['photos']);
      $servers = implode('|@|', $attachments['servers']);
      $hashes = implode('|@|', $attachments['hashes']);
      $docs = implode('|@|', $attachments['docs']);
      $videos = implode('|@|', $attachments['videos']);

      $response = json_decode(file_get_contents(
        'https://api.vk.com/method/execute.sendMessage?peer_id='.$dialog->dialog_id.
        '&message='.urlencode($text).'&photos='.$photos.'&servers='.$servers.
        '&hashes='.$hashes.'&docs='.$docs.'&videos='.$videos.
        '&random_id='.random_int(0, 2000000000).'&access_token='.$messenger->token.'&v=5.92'
      ))->response;

      $author = $response->author;

      $authorId = Author::firstOrCreate([
        'author_id' => $author->author_id,
        'first_name' => $author->first_name,
        'last_name' => $author->last_name,
        'avatar' => $author->avatar,
      ])->id;

      $message = $response->message;

      $newMessage = Message::create([
        'message_id' => $message->message_id,
        'dialog_id' => $dialog->id,
        'author_id' => $authorId,
        'text' => $message->text,
        'from_me' => true,
        'timestamp' => $message->timestamp.'000',
      ]);

      foreach ($message->attachments as $attachment) {
        Attachment::create([
          'type' => $attachment->type,
          'message_id' => $newMessage->id,
          'url' => $attachment->url,
          'name' => $attachment->name,
        ]);
      }

      $dialog->last_message = array(
        'text' => $message->text,
        'timestamp' => $newMessage->timestamp,
        'with_attachments' => count($message->attachments) > 0,
      );
      $dialog->save();

      return response()->json([
        'success' => true,
        'message' => $newMessage
      ]);
    }

    /**
     * Send message to the inst.
     *
     * @param Messenger $messenger
     * @param string $dialogId
     * @param $text
     * @param array $attachments
     * @return \Illuminate\Http\Response
     */
    private function sendInstMessage(Messenger $messenger, string $dialogId, $text, array $attachments)
    {
      $inst = new Instagram(false, false);

      try {
          $inst->login($messenger->login, $messenger->password);
      } catch (\Exception $e) {
          info('Something went wrong: '.$e->getMessage());
          exit(0);
      }

      $direct =  $inst->direct;

      if (isset($text))
      {
        $direct->sendText(
          array('thread' => $dialogId),
          $text
        );
      }

      set_time_limit(120);
      try {
        foreach ($attachments as $attachment) {
          switch ($attachment['type']) {
            case 'image':
              $direct->sendPhoto(
                array('thread' => $dialogId),
                $attachment['path']
              );
              break;
            case 'video':
              $direct->sendVideo(
                array('thread' => $dialogId),
                $attachment['path']
              );
              break;
          }
        }
      } catch(Exception $e) {
        info($e);
      }
    }

    /**
     * Send message to the wapp.
     *
     * @param Request $request
     * @param Dialog $dialog
     * @param string $text
     * @param array $attachments
     * @return \Illuminate\Http\Response
     */
    private function sendWappMessage(Request $request, Dialog $dialog, string $text, array $attachments)
    {
      $wapp = $request->user()->wapp();
      $url = $wapp->url.'message?token='.$wapp->token;
      $data;

      if (property_exists($request, 'phone'))
      {
        $data = json_encode([
          'phone' => $request->phone,
          'body' => $text,
        ]);
      }
      else {
        $data = json_encode([
         'chatId' => $dialog->dialog_id,
         'body' => $text,
       ]);
      }

      $options = stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => 'Content-type: application/json',
        'content' => $data
      ]]);
      file_get_contents($url, false, $options);

      foreach ($attachments as $attachment) {
        // code...
      }
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
