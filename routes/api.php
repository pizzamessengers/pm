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
Route::get('v1/messengers/wapp/status', 'MessengerController@getStatusWapp');
Route::group(['middleware' => 'CheckForValidMessenger'], function() {
  Route::get('v1/messengers/{messenger}/getDialogs', 'MessengerController@getDialogsSortedByLastMessageTimestamp');
  Route::get('v1/messengers/settings/{messenger}/getDialogs', 'MessengerController@getSettingsDialogs');
  Route::put('v1/messengers/watching/{messenger}', 'MessengerController@toggleWatching');
  Route::put('v1/messengers/updating/{messenger}', 'MessengerController@toggleUpdating');
});

Route::post('v1/dialogs', 'DialogController@addDialogs');
Route::get('v1/dialogs/vk', 'DialogController@vkRefresh');
Route::get('v1/dialogs/vk/attaurls', 'DialogController@getVkAttaUrls');
Route::post('v1/dialogs/vk', 'DialogController@connectVkDialog');
Route::group(['middleware' => 'CheckForValidDialog'], function() {
  Route::get('v1/dialogs/{dialog}', 'DialogController@getMessages');
  Route::post('v1/dialogs/{dialog}', 'DialogController@unsubscribe');
  Route::delete('v1/dialogs/{dialog}', 'DialogController@deleteDialog');
  Route::put('v1/dialogs/{dialog}', 'DialogController@toggleUpdating');
});

Route::post('v1/messages/send', 'MessageController@sendMessage');

Route::post('v1/messages/wapp', 'MessageController@wapp');// TODO: validation
Route::post('v1/messages/tlgrm', 'MessageController@tlgrm');// TODO: validation
Route::post('v1/messages/vk', 'MessageController@vk');

Route::post('v1/messages/vkatta', 'MessageController@uploadVkAttachment');

Route::get('v1/users/getDialogs', 'UserController@getDialogsSortedByLastMessageTimestamp');
Route::post('v1/users/language', 'UserController@changeLanguage');

Route::get('v1/crm', 'CrmController@disconnectCrm');
Route::post('v1/crm', 'CrmController@connectCrm');
Route::post('v1/crm/disconnect', 'CrmController@disconnectCrm');
