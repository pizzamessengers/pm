<?php

use Illuminate\Database\Seeder;

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
      'id' => str_random(32),
      'api_token' => str_random(32),
      'name' => 'admin',
      'email' => '1@q',
      'password' => Hash::make('1'),
    ]);
  }
}
