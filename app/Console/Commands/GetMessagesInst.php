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
          $lastMessageTimestamp = substr($thread->getLastPermanentItem()->getTimestamp(), 0, 10);

          //если время последнего сообщения раньше регистрации мессенджера
          if ((int) $lastMessageTimestamp <= (int) $messengerCreatedAt) break;

          if ($messenger->watching === 'dialogs')
          {
            if ($i === 19)
            {
              $threads = $inst->direct->getInbox($threadId)->getInbox()->getThreads();
              $this->updateThreads($threads, $messenger, $inst);
            }
            else continue;
          }

          $lastMessageText = $thread->getLastPermanentItem()->getText();
          if ($lastMessageText === null)
          {
            $lastMessageText = '';
          }
          else if (strlen($lastMessageText) > 40)
          {
            $lastMessageText = mb_substr($lastMessageText, 0, 40, 'UTF-8').'...';
          }

          if (count($thread->getUsers()) === 1)
          {
            $photo = $thread->getUsers()[0]->getProfilePicUrl();
          }
          else $photo = 'https://vk.com/images/camera_100.png';

          $dialog = Dialog::create([
            'messenger_id' => $messenger->id,
            'dialog_id' => $threadId,
            'name' => $thread->getThreadTitle(),
            'last_message' => json_encode([
              'id' => $thread->getLastPermanentItem()->getItemId(),
              'text' => $lastMessageText,
              'timestamp' => $thread->getLastPermanentItem()->getTimestamp(),
            ]),
            'members_count' => count($thread->getUsers()) + 1,
            'photo' => $photo,
            'unread_count' => 0,
          ]);

          $thread = $inst->direct->getThread($threadId)->getThread();
          $this->addMessagesNewDialog($thread, $dialog, $inst, (int) $messengerCreatedAt);
        }
        else
        {
          if ($dialog->updating === false) continue;
          if ($thread->getLastPermanentItem()->getItemId() === $dialog->last_message_id) break;
          $thread = $inst->direct->getThread($threadId)->getThread();
          $this->addMessages($thread, $dialog, $inst);

          $lastMessageText = $thread->getLastPermanentItem()->getText();
          if ($lastMessageText === null)
          {
            $lastMessageText = '';
          }
          else if (strlen($lastMessageText) > 40)
          {
            $lastMessageText = mb_substr($lastMessageText, 0, 40, 'UTF-8').'...';
          }

          $dialog->last_message = json_encode([
            'id' => $thread->getLastPermanentItem()->getItemId(),
            'text' => $lastMessageText,
            'timestamp' => $thread->getLastPermanentItem()->getTimestamp(),
          ]);
          $dialog->save();
        }

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
     * @param int $messengerCreatedAt
     */
    private function addMessagesNewDialog(
      DirectThread $thread,
      Dialog $dialog,
      Instagram $inst,
      int $messengerCreatedAt
    )
    {
      $dialogId = $dialog->id;

      foreach ($thread->getItems() as $i=>$message)
      {
        if (substr($message->getTimestamp(), 0, 10) > $messengerCreatedAt)
        {
          $this->addMessage($message, $dialogId, $inst);

          if ($i === 19)
          {
            $thread = $inst->direct->getThread($thread->getThreadId(), $message->getItemId())->getThread();
            $this->addMessagesNewDialog($thread, $dialog, $inst, $messengerCreatedAt);
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
      $lastMessageId = json_decode($dialog->last_message)->id;

      foreach ($thread->getItems() as $i=>$message)
      {
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
        'text' => ($message->getItemType() === 'text') ? $message->getText() : '',
        'from_me' => $message->getUserId() === $inst->account_id ? true : false,
        'timestamp' => substr($message->getTimestamp(), 0, 10),
      ]);

      if ($message->getItemType() !== 'text')
      {
        $this->attachments($message, $newMessage->id);
      }
    }

    /**
     * Create attachment instance.
     *
     * @param DirectThreadItem $message
     * @param int $messageId
     */
    private function attachments(DirectThreadItem $message, int $messageId)
    {
        switch ($message->getItemType()) {
          case 'like':
            $type = 'image';
            $url = 'https://www.pinclipart.com/picdir/big/76-766851_jewlr-instagram-like-icon-png-clipart.png';
            $name = null;
            break;
          case 'media':
            $media = $message->getMedia();
            switch ($media->getMediaType()) {
              case 1:
                $type = 'image';
                $url = $media->getImageVersions2()->getCandidates()[0]->getUrl();
                $name = null;
                break;
            }
        }

        Attachment::create([
          'type' => $type,
          'message_id' => $messageId,
          'url' => $url,
          'name' => $name,
        ]);
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
