<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Crm extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'name', 'crm_user_id', 'api_token',
    ];
}
