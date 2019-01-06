<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Auth;

class CreateMessengersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messengers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->string('name');
            $table->string('login')
                  ->unique()
                  ->nullable();
            $table->string('password')
                  ->nullable();
            $table->string('token')
                  ->unique()
                  ->nullable();
            $table->string('lp_ts')
                  ->nullable();
            $table->string('lp_pts')
                  ->nullable();
            $table->string('watching');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE messengers AUTO_INCREMENT = 10000000");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messengers');
    }
}
