<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuthorDialogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('author_dialog', function (Blueprint $table) {
          $table->unsignedInteger('dialog_id');
          $table->unsignedInteger('author_id');
          $table->foreign('dialog_id')
                ->references('id')
                ->on('dialogs')
                ->onDelete('cascade');
          $table->foreign('author_id')
                ->references('id')
                ->on('authors')
                ->onDelete('cascade');
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
        Schema::dropIfExists('author_dialog');
    }
}
