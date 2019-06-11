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
use InstagramAPI\Instagram;
use VK\Client\VKApiClient;
use InstagramAPI\Response\DirectInboxResponse;
use Illuminate\Support\Facades\Storage;
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

      foreach($request->messages as $message)
      {
        if (($dialog = Dialog::where([
          ['dialog_id', $message['chatId']],
          ['messenger_id', $messenger->id]
        ])->first()) === null)
        {
          if ($messenger->watching === 'dialogs') continue;

          // если диалог не существует и messenger watching 'all'
          event(new MessagesCreated([$this->addMessage($message, $messenger)]));
        }
        else {
          if ($dialog->updating === false) continue;

          // если диалог существует и updating true

          $message = $this->addMessage($message, $messenger);

          if ($dialog->subscribed)
            event(new MessagesCreated([$message]));
        }
      }
    }

    /**
     * Processing telegram webhook.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function tlgrm(Request $request)
    {
      /*$messenger = Messenger::where('instance', $request->instanceId)->first();
      if ($messenger->updating === false) return;

      if (($dialog = Dialog::where([
        ['dialog_id', $message['chatId']],
        ['messenger_id', $messenger->id]
      ])->first()) === null)
      {
        if ($watching === 'dialogs') continue;
      }
      else if ($dialog->updating === false) continue;

      // если диалог существует и updating true или messenger watching 'all'
      if ($dialog->subscribed) event(new MessagesCreated([$this->addMessage($message, $messenger)]));*/
    }

    /**
     * Get vk dialog for dialog_id
     *
     * @param int $dialogId
     * @return Dialog $dialog
     */
    private function getDialog($dialogId)
    {
      $dialogs = Dialog::where('dialog_id', $dialogId)->get();

      if (count($dialogs) > 1) {
        foreach ($dialogs as $dialog) {
          $messenger = $dialog->messenger();
          if ($messenger->name === 'vk') break;
        }
      } else {
        $dialog = $dialogs->first();
      }

      return $dialog;
    }

    /**
     * Processing vk webhook.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function vk(Request $request)
    {
      $mainDialog = $this->getDialog($request->group_id);
      $messenger = $mainDialog->messenger();

      if (!$messenger->updating || !$mainDialog->updating) return response('ok', 200);

      switch ($request->type) {
        case 'message_new':
        case 'message_reply':
          $message = $request->object;

          $dialog_author = $this->vkData($message, $messenger, $mainDialog);

          $newMessage = Message::firstOrCreate([
            'message_id' => $message['id'],
            'dialog_id' => $dialog_author[0]->id,
            'author_id' => $dialog_author[1],
            'text' => $message['text'] ? $message['text'] : '',
            'from_me' => $message['out'],
            'timestamp' => $message['date'].'000',
          ]);
          break;
        case 'confirmation':
          return $mainDialog->code;
      }

      if (count($message['attachments']) > 0)
        $this->vkAttachments($message['attachments'], $newMessage->id, $messenger);

      if ($dialog_author[0]->subscribed) event(new MessagesCreated([$newMessage]));

      return response('ok', 200);
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
      $authorId = $this->authorId($message['author'], $message['senderName'], $dialogId, 'wapp');

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

    private function tryToGetAuthor($userId, string $messName)
    {
      $authors = Author::where(
        'author_id',
        $userId
      )->get();

      $rightAuthor = null;

      if (count($authors) > 0) {
        foreach ($authors as $author) {
          if ($author->dialogs()[0]->messenger()->name === $messName)
          {
            $rightAuthor = $author;
            break;
          }
        }
      }

      return $rightAuthor;
    }

    private function createVkDialog($messengerId, $message, $author, string $token)
    {
      return Dialog::create([
        'messenger_id' => $messengerId,
        'dialog_id' => $message['peer_id'],
        'name' => $author->first_name.' '.$author->last_name,
        'last_message' => array(
          'text' => $message['text'] ? $message['text'] : '',
          'timestamp' => $message['date'].'000',
          'with_attachments' => count($message['attachments']) > 0,
        ),
        'members_count' => 2,
        'photo' => $author->avatar,
        'token' => $token
      ]);
    }

    /**
     * Get dialog id if exists or create new dialog
     * and author id if exists or create new author
     *
     * @param array $message
     * @param Messenger $messenger
     * @param Dialog $mainDialog
     * @return array [$dialog, $authorId]
     */
    private function vkData(array $message, Messenger $messenger, Dialog $mainDialog)
    {
      $fromId = $message['from_id'];

      if (($dialog = Dialog::where([
        ['messenger_id', $messenger->id],
        ['dialog_id', $message['peer_id']],
      ])->first()) === null)
      {
        $author = $this->tryToGetAuthor($fromId, 'vk');

        //если есть автор, но нет диалога
        if (!empty($author)) {
          $dialog = $this->createVkDialog($messenger->id, $message, $author, $mainDialog->token);
        } else {
          $response = json_decode(file_get_contents(
            'https://api.vk.com/method/execute.getAuthor?user_id='.
            $fromId.'&access_token='.$messenger->token.'&v=5.95'
          ))->response;

          $author = Author::create([
            'author_id' => $fromId,
            'first_name' => $response->first_name,
            'last_name' => $response->last_name,
            'avatar' => $response->avatar,
          ]);

          $dialog = $this->createVkDialog($messenger->id, $message, $author, $mainDialog->token);
        }

        if (DB::table('author_dialog')->where([
          'dialog_id' => $dialog->id,
          'author_id' => $author->id,
        ])->count() === 0)
        {
          DB::table('author_dialog')->insert([
            'dialog_id' => $dialog->id,
            'author_id' => $author->id,
          ]);
        }
      } else {
        $dialog->last_message = array(
          'text' => $message['text'] ? $message['text'] : '',
          'timestamp' => $message['date'].'000',
          'with_attachments' => count($message['attachments']) > 0,
        );
        $dialog->save();

        $author = $this->tryToGetAuthor($fromId, 'vk');
      }

      return [$dialog, $author->id];
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
     * @param string $messName
     * @param string $vkToken = null
     * @return int $authorId
     */
    private function authorId(string $userId, string $name, int $dialogId, string $messName, string $vkToken = null)
    {
      $author = $this->tryToGetAuthor($userId, $messName);

      if (empty($author)) {
        switch ($messName) {
          case 'wapp':
            $author = Author::create([
              'author_id' => $userId,
              'first_name' => $name,
              'last_name' => '',
              'avatar' => 'https://vk.com/images/camera_100.png',
            ]);
            break;
        }
      }

      if (DB::table('author_dialog')->where([
        'dialog_id' => $dialogId,
        'author_id' => $author->id,
      ])->count() === 0)
      {
        DB::table('author_dialog')->insert([
          'dialog_id' => $dialogId,
          'author_id' => $author->id,
        ]);
      }

      return $author->id;
    }

    /**
     * Upload vk attachment.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function uploadVkAttachment(Request $request)
    {
      $type = $request->type;
      $file = $request->{$type};
      $filePath = $file->store('attachments');
      $fullPath = '/home/d/dmitrilya/dmitrilya.beget.tech/laravel/storage/app/'.$filePath;

      $vk = new VKApiClient();
      $result = $vk->getRequest()->upload($request->url, $type, $fullPath);

      Storage::delete($filePath);

      return response()->json([
        'success' => true,
        'data' => $result
      ]);
    }

    /**
     * Create attachment instance.
     *
     * @param object type of attachment $type
     * @param int $messageId
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
     * Create vk attachment instance.
     *
     * @param array $attachments
     * @param int $messageId
     * @param Messenger $messenger
     */
    private function vkAttachments(array $attachments, int $messageId, Messenger $messenger)
    {
      foreach ($attachments as $attachment) {
        switch ($attachment['type']) {
          case 'audio_message':
            $type = 'audio';
            $name = null;
            $url = $attachment['audio_message']['link_mp3'];
            break;
          case 'doc':
            $type = 'doc';
            $name = $attachment['doc']['title'];
            $url = $attachment['doc']['url'];
            /*$preview = $attachment->doc->preview;
            switch (key($preview)) {
              case 'audio_msg':
                $type = 'audio';
                $name = null;
                $url = $preview->audio_msg->link_mp3;
                break;
              case 'photo':
                $type = 'photo';
                $name = null;
                $url = $preview->photo->sizes[0]->src;
                break;
            }*/
            break;
          case 'photo':
            $type = 'image';
            $name = null;
            foreach ($attachment['photo']['sizes'] as $size) {
              if ($size['type'] === 'x')
              {
                $url = $size['url'];
                break;
              }
            }
            break;
          case 'video':
            $type = 'video';

            $video = json_decode(file_get_contents(
              'https://api.vk.com/method/execute.video?videos='.$attachment['video']['owner_id'].
              '_'.$attachment['video']['id'].'&access_token='.$messenger['token'].'&v=5.92'
            ))->response;

            $name = null;
            $url = ($video['count'] === 0) ? 'https://vk.com/images/camera_100.png' : $video['items'][0]['player'];
            break;
          case 'audio':
            $type = 'audio';
            $name = $attachment['audio']['title'].' - '.$attachment['audio']['artist'];
            $url = $attachment['audio']['url'];
            $url = substr($url, 0, strpos($url, "mp3")+3);
            break;
          case 'sticker':
            $type = 'image';
            $name = null;
            $url = $attachment['sticker']['images'][1]['url'];
            break;
          case 'market':
            $type = 'market';
            $url = 'kek';
            // TODO: market
            break;
          case 'link':
            $type = 'link';
            $url = $attachment['link']['url'];
            $name = $attachment['link']['title'];
            // TODO: market
            break;
        }

        if (!isset($type))
          continue;

        Attachment::firstOrCreate([
          'type' => $type,
          'message_id' => $messageId,
          'url' => $url,
          'name' => $name,
        ]);
      }
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
      $photos = $attachments['photos'];
      $servers = $attachments['servers'];
      $hashes = $attachments['hashes'];
      $docs = $attachments['docs'];
      $videos = $attachments['videos'];

      $as = "";

      if (count($photos) > 0) {
        foreach ($photos as $i => $photo) {
          $p = json_decode(file_get_contents(
            'https://api.vk.com/method/photos.saveMessagesPhoto?photo='.
            $photo.'&server='.$servers[$i].'&hash='.$hashes[$i].'&access_token='.$dialog->token.'&v=5.95'
          ))->response[0];

          $as .= $as."photo".$p->owner_id."_".$p->id.",";
        }
      }

      if (count($docs) > 0) {
        foreach ($docs as $i => $doc) {
          $d = json_decode(file_get_contents(
            'https://api.vk.com/method/docs.save?file='.
            $doc.'&access_token='.$messenger->token.'&v=5.95'
          ))->response->doc;

          $as = $as."doc".$d->owner_id."_".$d->id.",";
        }
      }

      if (count($videos) > 1) {
        for ($i=1; $i < count($videos); $i++) {
          $as = $as."video".$videos[0]."_".$videos[$i].",";
        }
      }

      $text = !empty($text) ? urlencode($text) : "";

      $messageId = file_get_contents(
        'https://api.vk.com/method/messages.send?peer_id='.
        $dialog->dialog_id.'&message='.$text.'&attachment='.$as.
        '&random_id='.random_int(0, 2000000000).'&access_token='.$dialog->token.'&v=5.95'
      );

    /*  var response = API.messages.getById({
          "message_ids": messageId,
          "extended": 1,
          "fields": "photo_100"
      });

      var message = response.items[0];
      var attachments = message.attachments;
      var author = response.profiles[0];

      var j = 0,
          attachment,
          attachmentList = [];
      while (j < attachments.length) {
          attachment = attachments[j];
          if (attachment.type == "photo") {
              attachmentList.push({
                  "type": "image",
                  "name": null,
                  "url": attachment.photo.sizes[2].url
              });
          } else if (attachment.type == "doc") {
              attachmentList.push({
                  "type": "doc",
                  "name": attachment.doc.title,
                  "url": attachment.doc.url
              });
          } else if (attachment.type == "video") {
              var v = attachment.video;
              var url = API.video.get({
                  "videos": v.owner_id+"_"+v.id

              }).items[0].player;

              attachmentList.push({
                  "type": "video",
                  "name": attachment.video.title,
                  "url": url
              });
          }
          j = j + 1;
      }

      return {
          "message": {
              "message_id": messageId,
              "text": message.text,
              "timestamp": message.date,
              "attachments": attachmentList,
          },
          "author": {
              "author_id": author.id,
              "first_name": author.first_name,
              "last_name": author.last_name,
              "avatar": author.photo_100,
          }
      };

      $response = file_get_contents(
        'https://api.vk.com/method/execute.sendMessage?peer_id='.$dialog->dialog_id.
        '&message='.urlencode($text).'&photos='.$photos.'&servers='.$servers.
        '&hashes='.$hashes.'&docs='.$docs.'&videos='.$videos.
        '&random_id='.random_int(0, 2000000000).'&access_token='.$messenger->token.'&v=5.92'
      );
      info($response);

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
      $dialog->save();*/

      return response()->json([
        'success' => true,
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
