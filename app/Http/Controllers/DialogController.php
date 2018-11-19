<?php

namespace App\Http\Controllers;

use App\Dialog;
use App\Messenger;
use Illuminate\Http\Request;

class DialogController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDialog(Request $request)
    {
      $name = $request['name'];

      $vk = new VK\Client\VKApiClient();

      $vk -> wall() -> post('ee78101106466c1503b75b69fd3fe42e23e288c36186417e73c864f7b019295f02041ce082338d132ba69', array(
          'owner_id' => 174092282,
          'from_group' => 1,
          'message' => 'kek',
      ));

      $id = $response['id'];

      $messenger_id = Auth::user()->$request['messenger'];

      $dialog = new Dialog;
      $dialog->id = str_random(32);
      $dialog->name = $request['name'];
      $dialog->dialog_id = $id;
      $dialog->messenger_id = $messenger_id;
      $dialog->save();

      $ourMessenger = Messenger::where('id', $messenger_id);
      $ourMessenger->dialogs .= ','.$id;
      $ourMessenger->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function show(Dialog $dialog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function edit(Dialog $dialog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Dialog $dialog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function deleteDialog(Dialog $dialog)
    {
      /*$name = ;
      Dialog::find($name)->delete();
      Auth::user()->{$request['name']} = null;
      Auth::user()->save();
      echo 101;*/
    }
}
