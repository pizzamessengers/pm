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

Route::post('v1/messengers', 'MessengerController@addMessenger');
Route::delete('v1/messengers', 'MessengerController@deleteMessenger');
Route::group(['middleware' => 'CheckForValidMessenger'], function() {
  Route::get('v1/messengers/{messenger}/getDialogs', 'MessengerController@getDialogsSortedByLastMessageTimestamp');
  Route::put('v1/messengers/watching/{messenger}', 'MessengerController@toggleWatching');
  Route::put('v1/messengers/updating/{messenger}', 'MessengerController@toggleUpdating');
});

Route::post('v1/dialogs', 'DialogController@addDialogs');
Route::group(['middleware' => 'CheckForValidDialog'], function() {
  Route::get('v1/dialogs/{dialog}', 'DialogController@getMessages');
  Route::delete('v1/dialogs/{dialog}', 'DialogController@deleteDialog');
  Route::put('v1/dialogs/{dialog}', 'DialogController@toggleUpdating');
});

Route::post('v1/messages/send', 'MessageController@sendMessage');

Route::post('v1/messages/wapp', 'MessageController@wapp');// TODO: validation

Route::get('v1/users/getDialogs', 'UserController@getDialogsSortedByLastMessageTimestamp');
Route::post('v1/users/language', 'UserController@changeLanguage');
