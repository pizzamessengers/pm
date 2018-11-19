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
  Route::get('/user', function (Request $request)
  {
      return $request->user();
  });

  Route::post('v1/messengers', [
    'middleware' => 'canAddMessenger',
    'uses' => 'MessengerController@addMessenger',
  ]);

  Route::delete('v1/messengers', 'MessengerController@deleteMessenger');

  Route::post('v1/dialogs', 'DialogController@addDialog');

  Route::delete('v1/dialogs', 'DialogController@deleteDialog');

  Route::post('v1/message', 'MessageController@addMessage');
});

Route::get('v1/api_token', 'UserController@getApiToken');

Route::get('v1/alerts/{code}', 'AlertController@alert')->name('alert');
