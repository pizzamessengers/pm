<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'auth:api'], function()
{
  Route::post('v1/messengers', 'MessengerController@addMessenger');
  Route::delete('v1/messengers', 'MessengerController@deleteMessenger');

  Route::post('v1/dialogs', 'DialogController@addDialog');
  Route::delete('v1/dialogs', 'DialogController@deleteDialog');
  Route::put('v1/dialogs/{dialog}', 'DialogController@toggleUpdating');

  Route::post('v1/messages', 'MessageController@addMessage');
  Route::get('v1/messages/{dialog}', 'MessageController@show');
});
