<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class StoreAuthors implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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
    public function __construct(Array $profiles, Int $dialogId)
    {
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
      foreach ($this->profiles as $profile)
      {
        $authorId = Author::where('author_id', $profile['id'])->value('id');

        if ($authorId === null)
        {
          $author = new Author;
          $author->author_id = $profile['id'];
          $author->first_name = $profile['first_name'];
          $author->last_name = $profile['last_name'];
          $author->avatar = $profile['photo_100'];
          $author->save();

          $authorId = $author->id;
        }

        DB::table('author_dialog')->insert([
          'dialog_id' => $this->dialogId,
          'author_id' => $authorId,
        ]);
      }
    }
}
