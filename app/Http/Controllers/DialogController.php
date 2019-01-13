<?php

namespace App\Http\Controllers;

use DB;
use App\Author;
use App\Dialog;
use App\Messenger;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;

class DialogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addDialog(Request $request)
    {
        $messenger = $request->user()->vk();

        $vk = new VKApiClient();
        $token = $messenger->token;

        $vkReq = $vk->messages()->searchConversations($token, array(
          'q' => $request['name'],
        ));

        if (($count = $vkReq['count']) !== 1)
        {
          return $this->notTheOnly($count);
        }

        $dialog = $vkReq['items'][0];

        if (Dialog::where('dialog_id', $dialog['peer']['id'])
          ->where('messenger_id', $request->user()->vk()->id)->count() !== 0)
        {
          return response()->json([
            'success' => false,
            'message' => 'Диалог уже добавлен',
          ], 200);
        }

        $profiles = $vk->messages()->getConversationMembers($token, array(
          'peer_id' => $dialog['peer']['id'],
          'fields' => 'photo_100',
        ))['profiles'];

        $name = ($dialog['peer']['type'] === 'chat') ?
          $dialog['chat_settings']['title'] :
          ($profiles[0]['id'] === $dialog['peer']['id'] ?
            $profiles[0]['first_name'].' '.$profiles[0]['last_name'] :
            $profiles[1]['first_name'].' '.$profiles[1]['last_name']);

        $dialogData = array(
          'name' => $name,
          'messenger_id' => $messenger->id,
          'dialog_id' => $dialog['peer']['id']
        );

        $dialog = Dialog::create($dialogData);

        $this->storeAuthors($profiles, $dialog->id);

        return response()->json([
          'success' => true,
          'dialog' => [
            'name' => $name,
            'id' => $dialog->id,
          ]
        ], 200);
    }

    protected function notTheOnly(Int $count)
    {
      if ($count === 0)
      {
        return response()->json([
          'success' => false,
          'message' => 'нет диалога с похожим названием',
        ], 200);
      }
      else if ($count > 1)
      {
        return response()->json([
          'success' => false,
          'message' => 'у вас несколько диалогов с таким или похожим названием',
        ], 200);
      }
    }

    protected function storeAuthors(Array $profiles, Int $dialogId)
    {
      foreach ($profiles as $profile)
      {
        $authorId = Author::where('author_id', $profile['id'])->value('id');

        if ($authorId === null)
        {
          $author = new Author;
          $author->author_id = $profile['id'];
          $author->first_name = $profile['first_name'];
          $author->last_name = $profile['last_name'];
          $author->avatar = $profile['photo_100'];
          $author->save();

          $authorId = $author->id;
        }

        DB::table('author_dialog')->insert([
          'dialog_id' => $dialogId,
          'author_id' => $authorId,
        ]);
      }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function show(Dialog $dialog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function edit(Dialog $dialog)
    {
        //
    }

    /**
     * toggle updating of the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function toggleUpdating(Request $request, Dialog $dialog)
    {
        $dialog->updating = $request->updating;
        $dialog->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Dialog  $dialog
     * @return \Illuminate\Http\Response
     */
    public function deleteDialog(Dialog $dialog)
    {
      $dialog->authors()->each(function($author) {
                          if (count($author->dialogs()) === 1)
                          {
                            $author->delete();
                          }
                        });

      $dialog->messages()->each(function($message) {
                            $message->delete();
                          });

      $dialog->delete();
      return response()->json([
        'success' => true,
      ]);
    }
}
