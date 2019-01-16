<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('message_id');
          $table->unsignedInteger('dialog_id');
          $table->foreign('dialog_id')
                ->references('id')
                ->on('dialogs')
                ->onDelete('cascade');
          $table->text('text');
          $table->unsignedInteger('author_id');
          $table->foreign('author_id')
                ->references('id')
                ->on('authors')
                ->onDelete('cascade');
          $table->timestamps();
        });

        DB::statement("ALTER TABLE messages AUTO_INCREMENT = 10000000");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
