<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Messenger extends Model
{
    public $incrementing = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'login', 'password', 'token', 'user_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //'token',
    ];

    /**
     * Get the user for the messenger.
     */
    public function user()
    {
        return $this->belongsTo('App\User')->get();
    }

    /**
     * Get the dialogs for the messenger.
     */
    public function dialogs()
    {
        return $this->hasMany('App\Dialog');
    }
}
