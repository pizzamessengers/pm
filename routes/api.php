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

Route::get('v1/messengers/{messenger}', 'MessengerController@showMessages');
Route::post('v1/messengers', 'MessengerController@addMessenger');
Route::delete('v1/messengers', 'MessengerController@deleteMessenger');
Route::put('v1/messengers/watching/{messenger}', 'MessengerController@toggleWatching');
Route::put('v1/messengers/updating/{messenger}', 'MessengerController@toggleUpdating');

Route::get('v1/messengers/updater/{messenger}', 'MessengerController@startUpdating')->name('startUpdating');

Route::get('v1/dialogs/{dialog}', 'DialogController@show');
Route::post('v1/dialogs', 'DialogController@addDialog');
Route::delete('v1/dialogs', 'DialogController@deleteDialogs');
Route::delete('v1/dialogs/{dialog}', 'DialogController@deleteDialog');
Route::put('v1/dialogs/{dialog}', 'DialogController@toggleUpdating');

Route::post('v1/messages', 'MessageController@addMessage')->name('addMessage');

/*Route::get('v1/access_token/', function() {
  $vk = curl_init('http://m.vk.com/');
  curl_setopt_array($vk, array(
      CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 6.3; rv:38.0) Gecko/20100101 Firefox/38.0',
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_SSL_VERIFYPEER => false,
CURLOPT_COOKIEFILE => '')
  );

  preg_match('/<form method="post" action="([\w\W]+)" novalidate>/U', curl_exec($vk), $url);
  if(empty($url[1])) {
      curl_close($vk);
      return response()->json([
        'data' => 'false1'
      ]);
  }

  curl_setopt($vk, CURLOPT_URL,  $url[1]);
  curl_setopt($vk, CURLOPT_CUSTOMREQUEST, 'POST');
  curl_setopt($vk, CURLOPT_HTTPHEADER, array('Host' => 'login.vk.com'));
  curl_setopt($vk, CURLOPT_POST, true);
  curl_setopt($vk, CURLOPT_POSTFIELDS, http_build_query(array('email' => 'nick-nick6767@mail.ru', 'pass' => 'LifeIsGooddmitrilya1999')));
  curl_exec($vk);

  curl_setopt($vk, CURLOPT_URL, curl_getinfo($vk, CURLINFO_EFFECTIVE_URL));
  curl_setopt($vk, CURLOPT_CUSTOMREQUEST, 'GET');
  curl_setopt($vk, CURLOPT_HTTPHEADER, array('Host' => 'm.vk.com'));
  curl_setopt($vk, CURLOPT_POST, false);
  curl_exec($vk);

  curl_setopt($vk, CURLOPT_URL, 'https://oauth.vk.com/authorize?client_id=6820073&redirect_uri=https://oauth.vk.com/blank.html&display=page&scope=69648&response_type=token&v=5.92');

  preg_match('/<form method="post" action="([\w\W]+)">/U', curl_exec($vk), $url);
  info($url);
  if(empty($url[1])) {
      curl_close($vk);
      return response()->json([
        'data' => 'false2'
      ]);
  }

  curl_setopt($vk, CURLOPT_URL,  $url[1]);
  curl_setopt($vk, CURLOPT_CUSTOMREQUEST, 'POST');
  curl_setopt($vk, CURLOPT_HTTPHEADER, array('Host' => 'login.vk.com'));
  curl_setopt($vk, CURLOPT_POST, true);
  curl_exec($vk);
  info($url);
  $url = parse_url(curl_getinfo($vk, CURLINFO_EFFECTIVE_URL));
  parse_str($url['fragment'], $url);
  curl_close($vk);

  return response()->json([
    'data' => $url
  ]);
});*/
