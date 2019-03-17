<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use JavaScript;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Display the messages for the user.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getMessages(Request $request)
    {
        return response()->json([
          'success' => true,
          'messages' => $request->user()->messages()->sortBy('timestamp')->values(),
        ], 200);
    }
}
