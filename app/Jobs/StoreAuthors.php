<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Author;
use DB;

class StoreAuthors implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Messenger.
     *
     * @var string
     */
    protected $messenger;

    /**
     * Profiles of authors.
     *
     * @var array
     */
    protected $profiles;

    /**
     * The id of dialog.
     *
     * @var int
     */
    protected $dialogId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(string $messenger, array $profiles, Int $dialogId)
    {
      $this->messenger = $messenger;
      $this->profiles = $profiles;
      $this->dialogId = $dialogId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
      switch ($this->messenger) {
        case 'vk':
          $this->storeAuthorsVk();
          break;
        case 'inst':
          $this->storeAuthorsInst();
          break;
        case 'wapp':
          $this->storeAuthorsWapp();
          break;
      }
    }

    private function storeAuthorsVk() {
      foreach ($this->profiles as $profile)
      {
        $authorId = Author::firstOrCreate([
          'author_id' => $profile['id'],
          'first_name' => $profile['first_name'],
          'last_name' => $profile['last_name'],
          'avatar' => $profile['photo_100'],
        ])->id;

        DB::table('author_dialog')->insert([
          'dialog_id' => $this->dialogId,
          'author_id' => $authorId,
        ]);
      }
    }

    private function storeAuthorsInst() {
      foreach ($this->profiles as $profile)
      {
        $name = explode(' ', $profile->getFullName());
        $firstName = $name[0];
        $lastName = $name[1];
        $authorId = Author::firstOrCreate([
          'author_id' => $profile->getPk(),
          'first_name' => $firstName,
          'last_name' => $lastName,
          'avatar' => $profile->getProfilePicUrl(),
        ])->id;

        DB::table('author_dialog')->insert([
          'dialog_id' => $this->dialogId,
          'author_id' => $authorId,
        ]);
      }
    }
    // TODO:
    /*private function storeAuthorsVk() {
      foreach ($this->profiles as $profile)
      {
        $authorId = Author::firstOrCreate([
          'author_id' => $profile['id'],
          'first_name' => $profile['first_name'],
          'last_name' => $profile['last_name'],
          'avatar' => $profile['photo_100'],
        ])->id;

        DB::table('author_dialog')->insert([
          'dialog_id' => $this->dialogId,
          'author_id' => $authorId,
        ]);
      }
    }*/
}
