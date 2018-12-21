<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    public $incrementing = false;

    /**
     * Get the author's name for the message.
     */
    public function author()
    {
        return $this->belongsTo('App\Author')->get();
    }
}
