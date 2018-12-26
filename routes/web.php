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

Route::fallback([
  'middleware' => 'auth',
  'uses' => function()
  {
    return view('welcome');
  }
]);

Route::get('csrf', 'Controller@csrf')->name('csrf');

Route::get('register', 'Auth\RegisterController@index');
Route::post('register', 'Auth\RegisterController@register')->name('register');

Route::get('login', 'Auth\LoginController@index');
Route::post('login', 'Auth\LoginController@login')->name('login');
Route::post('logout', 'Auth\LoginController@logout')->name('logout');
Route::get('logout', 'Auth\LoginController@index');

Route::get('home', 'HomeController@index')->name('home');
