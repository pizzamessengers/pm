<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Attachment;
use App\Messenger;
use App\Dialog;
use App\Message;
use App\Author;
use DB;

class GetMessagesVk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'getMessages:vk';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
      $this->update();
    }

    /**
     * Update vk messengers.
     *
     */
    private function update()
    {
      Messenger::where('name', 'vk')
        ->where('updating', true)
        ->get()->each(function(Messenger $messenger) {
          $lp = $messenger->lp;
          $watching = $messenger->watching;

          $response = json_decode(file_get_contents(
            'https://api.vk.com/method/execute.lpHistory?ts='.$lp['ts'].'&pts='.$lp['pts'].'&access_token='.$messenger->token.'&v=5.92'
          ))->response;
          $messages = $response->messages;

          if ($messages->count > 0)
          {
            $profiles = property_exists($response, 'profiles') ? $response->profiles : [];
            $groups = property_exists($response, 'groups') ? $response->groups : [];

            $messages = array();
            foreach ($messages->items as $message)
            {
              if ($watching !== Messenger::find($messenger->id)->watching) break;
              if (($dialog = Dialog::where([
                ['dialog_id', $message->peer_id],
                ['messenger_id', $messenger->id]
              ])->first()) === null)
              {
                if ($watching === 'dialogs') continue;
              }
              else if ($dialog->updating === false) continue;

              array_push($messages, $this->addMessage($message, $profiles, $groups, $messenger));
            }

            event(new MessagesCreated($messages));

            $lp['pts'] = $response->new_pts;
            $messenger->lp = $lp;
            $messenger->save();
          }
        });
    }

    /**
     * Create new message and author if doesn't exist.
     *
     * @param object data about message $message
     * @param array array of profiles from response $profiles
     * @param array array of groups from response $groups
     * @param Messenger $messenger
     * @return Message
     */
    private function addMessage(object $message, array $profiles, array $groups, Messenger $messenger)
    {
      $dialog = $this->dialog($message->peer_id, $messenger);
      $authorId = $this->authorId($message->from_id, $dialog->id, $profiles, $groups);

      $newMessage = Message::firstOrCreate([
        'message_id' => $message->id,
        'dialog_id' => $dialog->id,
        'author_id' => $authorId,
        'text' => $message->text,
        'from_me' => $message->out,
        'timestamp' => $message->date.'000',
      ]);

      if (!$message->out)
      {
        $dialog->unread_count++;
      } else {
        $dialog->unread_count = 0;
      }

      if (strlen($message->text) > 40)
      {
        $message->text = mb_substr($message->text, 0, 40, 'UTF-8').'...';
      }

      $dialog->last_message = array(
        'text' => $message->text,
        'timestamp' => $newMessage->timestamp,
        'with_attachments' => count($message->attachments) > 0,
      );
      $dialog->save();

      if (count($message->attachments) > 0)
      {
        $this->attachments($message->attachments, $newMessage->id, $messenger);
      }

      return $newMessage;
    }

    /**
     * Create attachment instance.
     *
     * @param array $attachments
     * @param int $messageId
     * @param Messenger $messenger
     */
    private function attachments(array $attachments, int $messageId, Messenger $messenger)
    {
      foreach ($attachments as $attachment) {
        switch ($attachment->type) {
          case 'audio_message':
            $type = 'audio';
            $name = null;
            $url = $attachment->audio_message->link_mp3;
            break;
          case 'doc':
            $type = 'doc';
            $name = $attachment->doc->title;
            $url = $attachment->doc->url;
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
            foreach ($attachment->photo->sizes as $size) {
              if ($size->type === 'x')
              {
                $url = $size->url;
                break;
              }
            }
            break;
          case 'video':
            $type = 'video';

            $video = json_decode(file_get_contents(
              'https://api.vk.com/method/execute.video?videos='.$attachment->video->owner_id.'_'.$attachment->video->id.'&access_token='.$messenger->token.'&v=5.92'
            ))->response;

            $name = null;
            $url = ($video->count === 0) ? 'https://vk.com/images/camera_100.png' : $video->items[0]->player;
            break;
          case 'audio':
            $type = 'audio';
            $name = $attachment->audio->title.' - '.$attachment->audio->artist;
            $url = $attachment->audio->url;
            $url = substr($url, 0, strpos($url, "mp3")+3);
            break;
          case 'sticker':
            $type = 'image';
            $name = null;
            $url = $attachment->sticker->images[1]->url;
            break;
          case 'market':
            $type = 'market';
            $url = 'kek';
            // TODO: market
            break;
          case 'link':
            $type = 'link';
            $url = $attachment->link->url;
            $name = $attachment->link->title;
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
     * Get dialog id if exist or create new dialog.
     *
     * @param int id of dialog from response $dialogId
     * @param Messenger $messenger
     * @return Dialog $dialog
     */
    private function dialog(int $dialogId, Messenger $messenger)
    {
      if (($dialog = Dialog::where([
        ['messenger_id', $messenger->id],
        ['dialog_id', (string) $dialogId],
      ])->first()) === null)
      {
        $chat = json_decode(file_get_contents(
          'https://api.vk.com/method/execute.convById?peer_ids='.$dialogId.'&access_token='.$messenger->token.'&v=5.92'
        ))->response;

        if ($chat->type === 'user')
        {
          foreach ($chat->profiles as $profile)
          {
            if ($profile->id === $chat->id) break;
          }

          $name = $profile->first_name.' '.$profile->last_name;
          $photo = $profile->photo_100;
          $membersCount = 2;
        }
        else if ($chat->type === 'chat')
        {
          $set = $chat->settings;
          $name = $set->title;
          $photo = property_exists($set, 'photo') ?
            $set->photo->photo_100 :
            'https://vk.com/images/camera_100.png';
          $membersCount = $set->members_count;
        }
        else if ($chat->type === 'group')
        {
          $group = $chat->group;
          $name = $group->name;
          $photo = property_exists($group, 'photo_100') ?
            $group->photo_100 :
            'https://vk.com/images/camera_100.png';
          $membersCount = 2;
        }

        $lastMessage = $chat->last_message;
        if (strlen($lastMessage->text) > 40)
        {
          $lastMessage->text = mb_substr($lastMessage->text, 0, 40, 'UTF-8').'...';
        }

        $dialog = Dialog::create([
          'messenger_id' => $messenger->id,
          'dialog_id' => (string) $dialogId,
          'name' => $name,
          'last_message' => array(
            'text' => $lastMessage->text,
            'timestamp' => $lastMessage->date.'000',
            'with_attachments' => count($lastMessage->attachments) > 0,
          ),
          'members_count' => $membersCount,
          'photo' => $photo,
          'unread_count' => 0,
        ]);
      }

      return $dialog;
    }

    /**
     * Get author id if exist or create new author.
     *
     * @param int id of message author from response $fromId
     * @param int $dialog
     * @param array profiles from lp response $profiles
     * @param array groups from lp response $groups
     * @return int author id
     */
    private function authorId(int $fromId, int $dialogId, array $profiles, array $groups)
    {
      $authors = Author::where(
        'author_id',
        $fromId
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
        foreach ($profiles as $profile)
        {
          if ($profile->id === $fromId)
          {
            $authorId = Author::create([
              'author_id' => $profile->id,
              'first_name' => $profile->first_name,
              'last_name' => $profile->last_name,
              'avatar' => $profile->photo_100,
            ])->id;
            break;
          }
        }

        foreach ($groups as $group)
        {
          if ('-'.$group->id == $fromId)
          {
            $authorId = Author::create([
              'author_id' => $fromId,
              'first_name' => $group->name,
              'last_name' => '',
              'avatar' => $group->photo_100,
            ])->id;
            break;
          }
        }
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
}
