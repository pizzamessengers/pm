<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\CrmConnection;
use App\Crm;
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
     * Connect CRM.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function connectCrm(Request $request)
    {
        $user = $request->user();

        //if ($user->paid) {
        Crm::create([
          'user_id' => $user->id,
          'crm_user_id' => $request->crmUserId,
          'name' => $request->crm,
          'api_token' => $request->token,
        ]);

        event(new CrmConnection($user, $request->crm));

        return response()->json([
          'success' => true
        ]);
        /*} else {
          return response()->json([
            'success' => false,
            'message' => 'check paid'
          ]);
        }*/


    }

    /**
     * Disconnect CRM.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function disconnectCrm(Request $request)
    {
        $user = $request->user();
        $user->crm->delete();

        event(new CrmConnection($user, null));

        return response()->json([
          'success' => true
        ]);
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
