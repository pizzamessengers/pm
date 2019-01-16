<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'author_id', 'first_name', 'last_name', 'avatar',
    ];

    /**
     * Get the dialogs for the author.
     */
    public function dialogs()
    {
        return $this->belongsToMany('App\Dialog')->get();
    }

    /**
     * Get the messages for the author.
     */
    public function messages()
    {
        return $this->hasMany('App\Message')->get();
    }
}
