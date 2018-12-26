<?php

namespace App\Http\Controllers;

use App\Messenger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessengerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
      public function addMessenger(Request $request)
      {
        $messengerData = $request->all();
        $messengerData['user_id'] = Auth::id();
        $messenger = Messenger::create($messengerData);

        return response()->json([
          'success' => true,
          'messenger' => $messenger
        ], 200);
      }

    /**
     * Display the specified resource.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function show(Messenger $messenger)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function edit(Messenger $messenger)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Messenger $messenger)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Messenger  $messenger
     * @return \Illuminate\Http\Response
     */
    public function deleteMessenger(Request $request)
    {
        $messenger = Auth::user()->{$request['name']}()->delete();

        return response()->json([
          'success' => true,
        ]);
    }
}
