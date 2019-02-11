<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use VK\Client\VKApiClient;
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
          $vk = new VKApiClient();
          $lp = json_decode($messenger->lp);
          $watching = $messenger->watching;

          $response = $vk->messages()->getLongPollHistory($messenger->token, array(
            'ts' => $lp->ts,
            'pts' => $lp->pts,
            'fields' => 'photo_100',
            'lp_version' => 3,
          ));

          $messages = $response['messages'];

          if ($messages['count'] > 0)
          {
            $profiles = $response['profiles'];

            foreach ($messages['items'] as $message)
            {
              if ($watching !== Messenger::find($messenger->id)->watching) break;
              if ($watching === 'all')
              {
                $this->addMessage($message, $profiles, $messenger, $vk);
              }
              else
              {
                if (($dialog = Dialog::where('dialog_id', $message['peer_id'])->first()) !== null)
                // TODO: if dialogs have same id in vk and other mess
                {
                  if ($dialog->updating === true)
                  {
                    $this->addMessage($message, $profiles, $messenger, $vk);
                  }
                }
              }
            }

            $lp->pts = $response['new_pts'];
            $messenger->lp = json_encode($lp);
            $messenger->save();
          }
        });
    }

    /**
     * Create new message and author if doesn't exist.
     *
     * @param array data about message $message
     * @param array array of profiles from response $profiles
     * @param Messenger $messenger
     * @param VKApiClient $vk
     */
    private function addMessage(array $message, array $profiles, Messenger $messenger, VKApiClient $vk)
    {
      $dialogId = $this->dialogId($message['peer_id'], $messenger, $vk);
      $authorId = $this->authorId($message['from_id'], $dialogId, $profiles);

      $newMessage = Message::create([
        'message_id' => (string) $message['id'],
        'dialog_id' => $dialogId,
        'author_id' => $authorId,
        'text' => $message['text'],
        'from_me' => $message['out'],
      ]);

      if (count($message['attachments']) > 0)
      {
        $this->attachments($message['attachments'], $newMessage->id, $messenger, $vk);
      }
    }

    /**
     * Create attachment instance.
     *
     * @param array $attachments
     * @param int $messageId
     * @param Messenger $messenger
     * @param VKApiClient $vk
     */
    private function attachments(Array $attachments, Int $messageId, Messenger $messenger, VKApiClient $vk)
    {
      foreach ($attachments as $attachment) {
        switch ($attachment['type']) {
          case 'doc':
            $preview = $attachment['doc']['preview'];
            switch (key($preview)) {
              case 'audio_msg':
                $type = 'audio';
                $name = null;
                $url = $preview['audio_msg']['link_mp3'];
                break;
              case 'photo':
                $type = 'photo';
                $name = null;
                $url = $preview['photo']['sizes'][0]['src'];
                break;
            }
            break;
          case 'photo':
            $type = 'photo';
            $name = null;
            foreach ($attachment['photo']['sizes'] as $size) {
              if ($size['type'] === 'm')
              {
                $url = $size['url'];
                break;
              }
            }
            break;
          case 'video':
            $type = 'video';

            $video = $vk->video()->get($messenger->token, array(
              'videos' => $attachment['video']['owner_id'].'_'.$attachment['video']['id'],
            ));

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
            $type = 'sticker';
            $name = null;
            $url = $attachment['sticker']['images'][1]['url'];
            break;
          case 'market':
            $type = 'market';
            $url = 'kek';
            // TODO: market
            break;
        }

        Attachment::create([
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
     * @param VKApiClient $vk
     * @return int dialog id $dialogId
     */
    private function dialogId(Int $dialogId, Messenger $messenger, VKApiClient $vk)
    {
      if (($dialog = Dialog::where([
        ['messenger_id', $messenger->id],
        ['dialog_id', (string) $dialogId],
      ])->first()) === null)
      {
        $chat = $vk->messages()->getConversationsById($messenger->token, array(
          'peer_ids' => $dialogId,
          'extended' => 1,
        ));
        if ($chat['items'][0]['peer']['type'] === 'user')
        {
          foreach ($chat['profiles'] as $profile) {
            if ($profile['id'] === $chat['items'][0]['peer']['id'])
            {
              $name = $profile['first_name'].' '.$profile['last_name'];
              break;
            }
          }
        }
        else
        {
          $name = $chat['items'][0]['chat_settings']['title'];
        }

        $dialog = Dialog::create([
          'messenger_id' => $messenger->id,
          'dialog_id' => (string) $dialogId,
          'name' => $name,
        ]);
      }


      // TODO: если в разных мессенджерах будут совпадать id разных диалогов, то сделать доп. проверку

      return $dialog->id;
    }

    /**
     * Get author id if exist or create new author.
     *
     * @param int id of message author from response $fromId
     * @param int $dialog
     * @param array profiles from lp response $profiles
     * @return int author id
     */
    private function authorId(Int $fromId, Int $dialogId, Array $profiles)
    {
      $authorId = Author::where(
        'author_id',
        $fromId
      )->value('id');

      /*if (count($author_ids) > 1) {
        // TODO: если в разных мессенджерах будут совпадать id разных авторов, то сделать доп. проверку
      }
      else */
      if ($authorId === null)
      {
        foreach ($profiles as $profile)
        {
          if ($profile['id'] === $fromId) break;
        }

        $authorId = Author::create([
          'author_id' => $profile['id'],
          'first_name' => $profile['first_name'],
          'last_name' => $profile['last_name'],
          'avatar' => $profile['photo_100'],
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
}
