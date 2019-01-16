<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'message_id', 'type', 'url', 'name',
    ];

    /**
     * Get the message for the attachment.
     */
    public function message()
    {
        return $this->belongsTo('App\Message')->first();
    }
}
