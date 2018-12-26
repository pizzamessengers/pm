<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
    public function messages()
    {
        return $this->hasMany('App\Message')
                    ->get(['id', 'message_id', 'author_id', 'text'])
                    ->sortByDesc('message_id')
                    ->values()
                    ->each(function($message) {
                      $author = Author::find($message->author_id);
                      $message->author = [
                        'name' => $author->name,
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
