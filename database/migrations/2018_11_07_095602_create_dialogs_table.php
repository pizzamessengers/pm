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
          $table->string('id', 32)
                ->primary();
          $table->string('messenger_id', 32);
          $table->foreign('messenger_id')
                ->references('id')
                ->on('messengers')
                ->onDelete('cascade');
          $table->string('name');
          $table->string('last_message_id');
          $table->string('dialog_id');
          $table->boolean('updating')->default(true);
          $table->timestamps();
        });
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
