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
        $messenger = new Messenger;
        $messenger->id = str_random(32);
        $messenger->name = $request['name'];
        $messenger->user_id = Auth::id();
        $messenger->token = $request['token'] ?: $request['token'];
        $messenger->login = $request['login'] ?: $request['login'];
        $messenger->password = $request['password'] ?: $request['password'];
        $messenger->save();

        Auth::user()->{$request['name']} = $messenger->id;
        Auth::user()->save();

        return response()->json([
          'success' => true,
          $request['name'] => [
            'connected' => true,
          ]
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
        $id = Auth::user()->{$request['name']};
        Messenger::find($id)->delete();
        Auth::user()->{$request['name']} = null;
        Auth::user()->save();

        return response()->json([
          'success' => true,
        ]);
    }
}
