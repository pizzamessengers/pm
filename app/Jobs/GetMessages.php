<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use VK\Client\VKApiClient;
use App\Messenger;
use App\Dialog;

class GetMessages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
      //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
      $dialogs = Dialog::all();

      $vkClient = new VKApiClient();

      foreach ($dialogs as $dialog)
      {
        info($dialog->name);
        $token = Messenger::find($dialog->messenger_id)->token;

        $vkReq = $vkClient->messages()->getHistory($token, array(
          'peer_id' => $dialog->dialog_id,
          'count' => 1,
        ));

        $messageId = $vkReq['items'][0]['id'];

        if ($messageId != $dialog->last_message_id)
        {
          info($dialog->name . '  from: ' . $vkReq['items'][0]['from_id'] . '   text: ' . $vkReq['items'][0]['text']);
          $dialog->last_message_id = $messageId;
          $dialog->save();
        }
      }
      $this->release(3);
    }
}
