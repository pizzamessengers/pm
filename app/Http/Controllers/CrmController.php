<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CrmController extends Controller
{
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
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getCrmData(Request $request)
    {
        $crm = $request->user()->crm;

        return response()->json([
          'success' => true,
          'unparsed' => $crm->unparsed,
        ], 200);
    }
}
