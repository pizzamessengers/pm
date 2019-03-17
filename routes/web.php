<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'welcome');

Auth::routes();
Route::get('/logout', 'Auth\LoginController@logout')->name('logout' );

Route::group(['middleware' => 'auth'], function() {
  Route::get('app', 'Controller@createSocials')
    ->name('app');

  Route::get('app/socials/{messenger?}/{dialog?}/{dialogId?}', 'Controller@createSocials')
    ->where([
      'messenger' => 'vk||wapp||inst',
      'dialog' => 'dialog',
      'dialogId' => '[0-9]{8}',
    ])
    ->name('app');

  Route::get('app/settings/{setting?}/{module?}', 'Controller@createSocials')
    ->where([
      'setting' => 'messenger||profile||support',
      'module' => 'vk||wapp||inst||user||payment',
    ])
    ->name('app');
});

Route::get('home', 'HomeController@index')->name('home');
