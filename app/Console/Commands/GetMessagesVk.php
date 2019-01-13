<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use VK\Client\VKApiClient;
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
     * vk api client.
     *
     * @var VK\Client\VKApiClient
     */
    protected $vk;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->vk = new VKApiClient();
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
    protected function update()
    {
      Messenger::where('name', 'vk')
        ->where('updating', true)
        ->get()->each(function(Messenger $messenger) {
          $lp = json_decode($messenger->lp);

          $response = $this->vk->messages()->getLongPollHistory($messenger->token, array(
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
              if ($messenger->watching === 'all')
              {
                $this->addMessage($message, $profiles, $messenger->id);
              }
              else
              {
                if (($dialog = Dialog::where('dialog_id', $message['peer_id'])->first()) !== null)
                {
                  if ($dialog->updating == true)
                  {
                    $this->addMessage($message, $profiles, $messenger->id);
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
     * @param Array data about message $message
     * @param Array array of profiles from response $profiles
     * @param Int $messengerId
     */
    protected function addMessage(Array $message, Array $profiles, Int $messengerId)
    {
      $dialogId = $this->dialogId($message['peer_id'], $messengerId);

      foreach ($profiles as $profile)
      {
        if ($profile['id'] === $message['from_id']) break;
      }
      $authorId = $this->authorId($message['from_id'], $dialogId, $profile);

      $messageData = array(
        'message_id' => $message['id'],
        'dialog_id' => $dialogId,
        'author_id' => $authorId,
        'text' => $message['text'],
        //'attachments' => $message['attachments'],
      );

      $message = Message::create($messageData);
    }

    /**
     * Get dialog id if exist or create new dialog.
     *
     * @param Int id of dialog from response $dialogId
     * @param Int id of messenger $messengerId
     * @return Int dialog id $dialogId
     */
    protected function dialogId(Int $dialogId, Int $messengerId)
    {
      $dialog = Dialog::where('dialog_id', $dialogId)->first();

      /*if (count($author_ids) > 1) {
        // TODO: если в разных мессенджерах будут совпадать id разных диалогов, то сделать доп. проверку
      }
      else */
      if ($dialog === null)
      {
        $dialog = new Dialog;
        $dialog->messenger_id = $messengerId;
        $dialog->dialog_id = $dialogId;
        $dialog->updating = false;
        $dialog->save();

        $dialogId = $dialog->id;
      }
      else
      {
        $dialogId = $dialog->id;
      }

      return $dialogId;
    }

    /**
     * Get author id if exist or create new author.
     *
     * @param Int id of message author from response $fromId
     * @param Int id of dialog $dialogId
     * @return Int author id
     */
    protected function authorId(Int $fromId, Int $dialogId, Array $profile)
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
        $author = new Author;
        $author->author_id = $profile['id'];
        $author->first_name = $profile['first_name'];
        $author->last_name = $profile['last_name'];
        $author->avatar = $profile['photo_100'];
        $author->save();

        $authorId = $author->id;

        DB::table('author_dialog')->insert([
          'dialog_id' => $dialogId,
          'author_id' => $authorId,
        ]);
      }

      return $authorId;
    }
}
