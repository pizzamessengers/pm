<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * dialogs.
     *
     * @var array
     */
    protected $dialogs;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token', 'lang'
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
     * Get the tlgrm messenger for the user.
     */
    public function tlgrm()
    {
        return $this->hasOne('App\Messenger')->where('name', 'tlgrm')->first();
    }

    /**
     * Get the crm for the user.
     */
    public function crm()
    {
        return $this->hasOne('App\Crm');
    }

    /**
     * Get the dialogs for the user.
     */
    public function getDialogsWithLastMessageTimestamp()
    {
        $this->dialogs = collect();

        $this->hasMany('App\Messenger')->get()->each(function(Messenger $messenger) {
            $this->dialogs = $this->dialogs->merge($messenger->getDialogsWithLastMessageTimestamp());
        });

        return $this->dialogs;
    }
}
