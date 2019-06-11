<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Message;
use App\Author;

class Dialog extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'dialog_id',
        'messenger_id',
        'last_message',
        'photo',
        'members_count',
        'updating',
        'token',
        'group'
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
