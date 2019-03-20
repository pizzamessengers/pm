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
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'lp' => 'array',
    ];

    /**
     * messages.
     *
     * @var array
     */
    protected $messages;

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
     * Get the dialogs for the messenger.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function getDialogsWithLastMessageTimestamp()
    {
        return $this->dialogs()->get()
                  ->each(function($dialog) {
                    $dialog->last_message_timestamp = $dialog->last_message['timestamp'];
                    $dialog->mess = $this->name;
                  });
    }

    /**
     * Get the messages for the messenger.
     */
    public function messages()
    {
        $this->messages = collect();

        $this->hasMany('App\Dialog')->get()->each(function(Dialog $dialog) {
            $this->messages = $this->messages->merge($dialog->messages());
        });

        return $this->messages;
    }
}
