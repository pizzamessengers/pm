<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth:api');
    }

    public function getApiToken()
    {
        return Auth::user()->api_token;
    }

    public function auth($guard = null)
    {
        return json_encode(Auth::guard($guard)->check());
    }
}
