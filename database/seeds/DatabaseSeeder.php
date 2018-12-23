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
    $id = str_random(32);
    $messId = str_random(32);
    DB::table('users')->insert([
      'id' => $id,
      'api_token' => str_random(32),
      'name' => 'admin',
      'email' => '1@q',
      'password' => Hash::make('1'),
    ]);
    DB::table('messengers')->insert([
      'id' => $messId,
      'user_id' => $id,
      'name' => 'vk',
      'token' => '9d681fd899e777b9248d22b32414aea5b65c13f354afdcda93457edfdd9e0e3d44eea89d77e85742451c7',
    ]);
  }
}
