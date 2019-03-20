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

    /**
     * Get the messages for the dialog.
     */
    public function messages()
    {
      return $this->hasMany('App\Message')
                  ->get(['id', 'dialog_id', 'author_id', 'from_me', 'text', 'timestamp'])
                  ->values()
                  ->each(function(Message $message) {
                    $message->attachments = $message->attachments();
                    $dialog = $message->dialog();
                    $message->dialog = [
                      'id' => $dialog->id,
                      'name' => $dialog->name,
                    ];
                    $author = $message->author();
                    $message->author = [
                      'name' => $author->first_name.' '.$author->last_name,
                      'avatar' => $author->avatar,
                    ];
                    $message->mess = $dialog->messenger()->name;
                    unset($message->dialog_id);
                    unset($message->author_id);
                    unset($message->id);
                  });
    }

    /**
     * Get the messenger for the dialog.
     */
    public function messenger()
    {
        return $this->belongsTo('App\Messenger')->first();
    }

    /**
     * Get the authors for the dialog.
     */
    public function authors()
    {
        return $this->belongsToMany('App\Author')->get();
    }
}
