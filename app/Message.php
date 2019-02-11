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
        'message_id', 'dialog_id', 'text', 'author_id', 'from_me'
    ];

    /**
     * Get the author for the message.
     */
    public function author()
    {
        return $this->belongsTo('App\Author')->first();
    }

    /**
     * Get the dialog for the message.
     */
    public function dialog()
    {
        return $this->belongsTo('App\Dialog')->first();
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments()
    {
        return $this->hasMany('App\Attachment')->get(['type', 'url', 'name']);
    }
}
