<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDialogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dialogs', function (Blueprint $table) {
          $table->increments('id');
          $table->unsignedInteger('messenger_id');
          $table->foreign('messenger_id')
                ->references('id')
                ->on('messengers')
                ->onDelete('cascade');
          $table->string('name');
          $table->string('dialog_id');
          $table->json('last_message');
          $table->integer('unread_count')->default(0);
          $table->string('members_count');
          $table->string('photo');
          $table->boolean('updating')
                ->default(true);
          $table->boolean('subscribed')->default(false);
          $table->string('token')
                ->nullable();
          $table->string('server_id')
                ->nullable();
          $table->string('code')
                ->nullable();
          $table->string('group')
                ->default(false);
          $table->timestamps();
        });

        DB::statement("ALTER TABLE dialogs AUTO_INCREMENT = 10000000");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dialogs');
    }
}
