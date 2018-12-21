<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    public $incrementing = false;

    /**
     * Get the dialogs for the author.
     */
    public function dialogs()
    {
        return $this->belongsToMany('App\Dialog')->get();
    }
}
