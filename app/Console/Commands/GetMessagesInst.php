<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use InstagramAPI\Instagram;
use InstagramAPI\Response\Model\DirectThread;
use InstagramAPI\Response\Model\DirectThreadItem;
use InstagramAPI\Response\Model\User;
use App\Attachment;
use App\Messenger;
use App\Dialog;
use App\Message;
use App\Author;
use Illuminate\Support\Carbon;
use DB;

class GetMessagesInst extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'getMessages:inst';

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
      Messenger::where('name', 'inst')
        ->where('updating', true)
        ->get()->each(function(Messenger $messenger) {
          $inst = new Instagram(false, false);
          try {
              $inst->login($messenger->login, $messenger->password);
          } catch (\Exception $e) {
              info('Something went wrong: '.$e->getMessage());
              exit(0);
          }
          $watching = $messenger->watching;

          $threads = $inst->direct->getInbox()->getInbox()->getThreads();
          $this->updateThreads($threads, $messenger, $inst);
        });
    }

    /**
     * Update dialog and create if doesn't exist.
     *
     * @param DirectThread[] $threads
     * @param Messenger $messenger
     * @param Instagram $inst
     */
    private function updateThreads(array $threads, Messenger $messenger, Instagram $inst)
    {
      foreach ($threads as $i=>$thread)
      {
        $threadId = $thread->getThreadId();
        if (($dialog = Dialog::where('dialog_id', $threadId)->first()) === null)
        {
          $messengerCreatedAt = Carbon::parse(Messenger::find($messenger->id)->created_at)->timestamp;
          $lastMessageTimestamp = $thread->getLastPermanentItem()->getTimestamp();

          if ((int) $lastMessageTimestamp <= (int) $messengerCreatedAt) break;

          if ($messenger->watching === 'all')
          {
            $dialog = Dialog::create([
              'messenger_id' => $messenger->id,
              'dialog_id' => $threadId,
              'name' => $thread->getThreadTitle(),
            ]);
          }
          else continue;

          $thread = $inst->direct->getThread($threadId)->getThread();
          $this->addMessagesNewDialog($thread, $dialog, $inst, (int) $lastMessageTimestamp);
        }
        else
        {
          if ($dialog->updating === false) continue;
          if ($thread->getLastPermanentItem()->getItemId() === $dialog->last_message_id) break;
          $thread = $inst->direct->getThread($threadId)->getThread();
          $this->addMessages($thread, $dialog, $inst);
        }

        $dialog->last_message_id = $thread->getLastPermanentItem()->getItemId();
        $dialog->save();

        if ($i === 19)
        {
          $threads = $inst->direct->getInbox($threadId)->getInbox()->getThreads();
          $this->updateThreads($threads, $messenger, $inst);
        }
      }
    }

    /**
     * Create new messages for new dialog.
     *
     * @param DirectThread $messages
     * @param Dialog $dialog
     * @param Instagram $inst
     * @param int $lastMessageTimestamp
     */
    private function addMessagesNewDialog(
      DirectThread $thread,
      Dialog $dialog,
      Instagram $inst,
      int $lastMessageTimestamp
    )
    {
      $dialogId = $dialog->id;

      foreach ($thread->getItems() as $i=>$message)
      {
        if ($message->getItemType() !== 'text') continue;

        if ($message->getTimestamp() > $lastMessageTimestamp)
        {
          $this->addMessage($message, $dialogId, $inst);

          if ($i === 19)
          {
            $thread = $inst->direct->getThread($thread->getThreadId(), $message->getItemId())->getThread();
            $this->addMessagesNewDialog($thread, $dialog, $inst, $lastMessageTimestamp);
          }
        }
        else break;
      }
    }

    /**
     * Create new messages for not new dialog.
     *
     * @param DirectThread $messages
     * @param Dialog $dialog
     * @param Instagram $inst
     */
    private function addMessages(
      DirectThread $thread,
      Dialog $dialog,
      Instagram $inst
    )
    {
      $dialogId = $dialog->id;
      $lastMessageId = $dialog->last_message_id;

      foreach ($thread->getItems() as $i=>$message)
      {
        if ($message->getItemType() !== 'text') continue;

        if ($message->getItemId() !== $lastMessageId)
        {
          $this->addMessage($message, $dialogId, $inst);

          if ($i === 19)
          {
            $thread = $inst->direct->getThread($thread->getThreadId(), $message->getItemId())->getThread();
            $this->addMessages($thread, $dialog, $inst);
          }
        }
        else break;
      }
    }

    /**
     * Create new message and author if doesn't exist.
     *
     * @param DirectThreadItem $message
     * @param int $dialogId
     * @param Instagram $inst
     */
    private function addMessage(DirectThreadItem $message, int $dialogId, Instagram $inst)
    {
      $authorId = $this->authorId($message->getUserId(), $dialogId, $inst);

      $newMessage = Message::create([
        'message_id' => $message->getItemId(),
        'dialog_id' => $dialogId,
        'author_id' => $authorId,
        'text' => $message->getText(),
      ]);

    }

    /*
     * Create new message and author if doesn't exist.
     *
     * @param array data about message $message
     * @param array array of profiles from response $profiles
     * @param Messenger $messenger
     * @param VKApiClient $vk
     *
    private function addMessage(Array $message, Array $profiles, Messenger $messenger, VKApiClient $vk)
    {
      $dialogId = $this->dialogId($message['peer_id'], $messenger);
      $authorId = $this->authorId($message['from_id'], $dialogId, $profiles);

      $newMessage = Message::create([
        'message_id' => $message['id'],
        'dialog_id' => $dialogId,
        'author_id' => $authorId,
        'text' => $message['text'],
      ]);

      if (count($message['attachments']) > 0)
      {
        $this->attachments($message['attachments'], $newMessage->id, $messenger, $vk);
      }
    }*/

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
     * Get author id if exist or create new author.
     *
     * @param int $userId
     * @param int $dialogId
     * @param Instagram $inst
     * @return int authorId
     */
    private function authorId(int $userId, int $dialogId, Instagram $inst)
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
}
