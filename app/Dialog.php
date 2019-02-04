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
        'name', 'dialog_id', 'messenger_id', 'last_message_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //'last_message_id',
    ];

    /**
     * Get the messages for the dialog.
     */
    public function messages($that = null)
    {
        return $this->hasMany('App\Message')
                    ->get()
                    ->sortByDesc('message_id')
                    ->values()
                    ->each(function(Message $message) {
                      $message->attachments = $message->attachments();
                      $message->dialog = $message->dialog()->name;
                      $author = $message->author();
                      $message->author = [
                        'first_name' => $author->first_name,
                        'last_name' => $author->last_name,
                        'avatar' => $author->avatar,
                      ];
                    });
    }

    /**
     * Get the authors for the dialog.
     */
    public function authors()
    {
        return $this->belongsToMany('App\Author')->get();
    }
}
