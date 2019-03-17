<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'api_token',
    ];

    /**
     * messages.
     *
     * @var array
     */
    protected $messages;

    /**
     * Get the vk messenger for the user.
     */
    public function vk()
    {
        return $this->hasOne('App\Messenger')->where('name', 'vk')->first();
    }

    /**
     * Get the inst messenger for the user.
     */
    public function inst()
    {
        return $this->hasOne('App\Messenger')->where('name', 'inst')->first();
    }

    /**
     * Get the wapp messenger for the user.
     */
    public function wapp()
    {
        return $this->hasOne('App\Messenger')->where('name', 'wapp')->first();
    }

    /**
     * Get the messages for the user.
     */
    public function messages()
    {
        $this->messages = collect();

        $this->hasMany('App\Messenger')->get()->each(function(Messenger $messenger) {
            $this->messages = $this->messages->merge($messenger->messages());
        });

        return $this->messages;
    }
}
