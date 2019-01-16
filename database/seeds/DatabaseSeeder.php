<?php

use Illuminate\Database\Seeder;
use App\Jobs\GetMessages;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
    DB::table('users')->insert([
      'api_token' => str_random(32),
      'name' => 'admin',
      'email' => '1@q',
      'password' => Hash::make('1'),
    ]);
    /*DB::table('messengers')->insert([
      'user_id' => 10000000,
      'name' => 'vk',
      'token' => 'a9b9c1c2b31602cdfb753543525a0f28a05cfbb22c35d57853594b2189287b0ec85ca9b71b099346b93df',
      'watching' => 'all',
    ]);*/
  }
}
