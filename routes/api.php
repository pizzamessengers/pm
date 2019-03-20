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

Route::get('v1/messengers/{messenger}/getDialogs', 'MessengerController@getDialogsSortedByLastMessageTimestamp');
Route::post('v1/messengers', 'MessengerController@addMessenger');
Route::delete('v1/messengers', 'MessengerController@deleteMessenger');
Route::put('v1/messengers/watching/{messenger}', 'MessengerController@toggleWatching');
Route::put('v1/messengers/updating/{messenger}', 'MessengerController@toggleUpdating');

Route::get('v1/messengers/updater/{messenger}', 'MessengerController@startUpdating')->name('startUpdating');

Route::get('v1/dialogs/{dialog}', 'DialogController@show');
Route::post('v1/dialogs', 'DialogController@addDialogs');
Route::delete('v1/dialogs', 'DialogController@deleteDialogs');
Route::delete('v1/dialogs/{dialog}', 'DialogController@deleteDialog');
Route::put('v1/dialogs/{dialog}', 'DialogController@toggleUpdating');

Route::post('v1/messages', 'MessageController@addMessage')->name('addMessage');
Route::post('v1/messages/send', 'MessageController@sendMessage');

Route::post('v1/messages/wapp', 'MessageController@wapp');

Route::get('v1/user/getDialogs', 'UserController@getDialogsSortedByLastMessageTimestamp');
