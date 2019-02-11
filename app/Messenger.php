<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Messenger extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'login',
        'password',
        'token',
        'user_id',
        'watching',
        'lp',
        'instance',
        'url'
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
     * messages.
     *
     * @var array
     */
    protected $messages = [];

    /**
     * Get the user for the messenger.
     */
    public function user()
    {
        return $this->belongsTo('App\User')->first();
    }

    /**
     * Get the dialogs for the messenger.
     */
    public function dialogs()
    {
        return $this->hasMany('App\Dialog');
    }

    /**
     * Get the messages for the messenger.
     */
    public function messages()
    {
        $this->hasMany('App\Dialog')->get()->each(function(Dialog $dialog) {
           $dialog->messages()->each(function(Message $message) {
             array_push($this->messages, $message);
           });
        });

        if (count($this->messages) === 0)
        {
            return [];
        }

        usort($this->messages, function($a, $b)
        {
            return strcmp($b->message_id, $a->message_id);
        });

        return $this->messages;
    }
}
