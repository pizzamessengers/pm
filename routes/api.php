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
  Route::post('v1/messengers', [
    'uses' => 'MessengerController@addMessenger',
  ]);
  Route::delete('v1/messengers', 'MessengerController@deleteMessenger');

  Route::post('v1/dialogs', 'DialogController@addDialog');
  Route::delete('v1/dialogs{name}', 'DialogController@deleteDialog');

  Route::post('v1/message', 'MessageController@addMessage');
});
