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
          $table->string('name')
                ->nullable();
          $table->integer('dialog_id');
          $table->boolean('updating')
                ->default(true);
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
