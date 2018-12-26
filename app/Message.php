<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'message_id', 'dialog_id', 'text', 'attachments', 'author_id',
    ];

    /**
     * Get the author's name for the message.
     */
    public function author()
    {
        return $this->belongsTo('App\Author')->get();
    }
}
