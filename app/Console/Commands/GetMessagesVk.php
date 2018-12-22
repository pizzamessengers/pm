<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use VK\Client\VKApiClient;
use App\Messenger;
use App\Dialog;
use App\Message;
use App\Author;

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
      $dialogs = Dialog::where('updating', true)->get();

      $vkClient = new VKApiClient();

      foreach ($dialogs as $dialog)
      {
        info($dialog->name);
        $index = 0;

        $token = Messenger::find($dialog->messenger_id)->token;

        $vkReq = $vkClient->messages()->getHistory($token, array(
          'peer_id' => $dialog->dialog_id,
          'count' => 10,
        ));

        $messages = $vkReq['items'];
        $messages[10] = ['id' => 'q'];

        $this->update($index, $messages, $dialog);
      }
    }

    protected function update(Int $index, Array $messages, Dialog $dialog)
    {
      if ($messages[$index]['id'] != $dialog->last_message_id && $index < 10)
      {
        $this->update(++$index, $messages, $dialog);
      }
      else
      {
        for ($i=0; $i < $index; $i++)
        {
          $authors = Author::where(
            'author_id',
            $messages[$index-$i-1]['from_id']
          )->get();

          /*if (count($author_ids) > 1) {
            // TODO: если в разных мессенджерах будут совпадать id разных авторов, то сделать доп. проверку
          }
          else */
          if (count($authors) === 1) {
            $authorId = $authors[0]['id'];
          }
          else if (count($authors) === 0)
          {
            $profile = $vkClient->users()->get($token, array(
              'user_ids' => $messages[$index-$i-1]['from_id'],
              'fields' => 'photo_100'
            ));

            $author = new Author;
            $author->id = str_random(32);
            $author->author_id = $profile['id'];
            $author->name = $profile['first_name'] . ' ' . $profile['last_name'];
            $author->avatar = $profile['photo_100'];
            $author->save();

            $authorId = $author->id;
          }

          $messageData = array(
            'message_id' => $messages[$index-$i-1]['id'],
            'dialog_id' => $dialog->id,
            'author_id' => $authorId,
            'text' => $messages[$index-$i-1]['text'],
            'attachments' => $messages[$index-$i-1]['attachments'],
          );

          $message = new Message;
          $message->id = str_random(32);
          $message->message_id = $messageData['message_id'];
          $message->dialog_id = $messageData['dialog_id'];
          $message->author_id = $messageData['author_id'];
          $message->text = $messageData['text'];
          //$message->attachments = $messageData['attachments'];
          $message->save();
        }

        $dialog->last_message_id = $messages[0]['id'];
        $dialog->save();
      }
    }
}
