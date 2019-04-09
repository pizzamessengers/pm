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
     * Change language.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function changeLanguage(Request $request)
    {
        $user = $request->user();
        $user->lang = $request->lang;
        $user->save();

        return response()->json([
          'success' => true,
        ], 200);
    }

    /**
     * Display the dialogs for the user.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getDialogsSortedByLastMessageTimestamp(Request $request)
    {
        return response()->json([
          'success' => true,
          'dialogs' => $request->user()->getDialogsWithLastMessageTimestamp()->sortByDesc('last_message_timestamp')->values(),
        ], 200);
    }
}
