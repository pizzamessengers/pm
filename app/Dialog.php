<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Message;

class Dialog extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'dialog_id', 'messenger_id', 'last_message', 'photo', 'members_count', 'unread_count',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'last_message' => 'array',
    ];

    public static function boot() {
        parent::boot();

        self::deleting(function () {
          (new self)->messages()->each(function($message) {
            $message->delete();
          });

          (new self)->authors()->each(function($author) {
            if (count($author->dialogs()) === 1) {
              $author->delete();
            }
          });
        });
    }

    /**
     * Get the messages for the dialog.
     */
    public function messages() {
      return self::hasMany('App\Message')
        ->get(['id', 'author_id', 'from_me', 'text', 'timestamp'])
        ->values()
        ->each(function(Message $message) {
          $message->attachments = $message->attachments();
          $author = $message->author();
          $message->author = [
            'id' => $author->id,
            'name' => $author->first_name.' '.$author->last_name,
            'avatar' => $author->avatar,
          ];
          unset($message->author_id);
        });
    }

    /**
     * Get the messenger for the dialog.
     */
    public function messenger() {
        return self::belongsTo('App\Messenger')->first();
    }

    /**
     * Get the user for the dialog.
     */
    public function user() {
        return self::messenger()->belongsTo('App\User')->first();
    }

    /**
     * Get the authors for the dialog.
     */
    public function authors() {
        return self::belongsToMany('App\Author')->get();
    }
}
