<?php

namespace App\Http\Controllers;

use DB;
use App\Author;
use App\Dialog;
use App\Messenger;
use Illuminate\Http\Request;
use VK\Client\VKApiClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Queue;
use App\Jobs\GetMessages;

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
      $mess = $request['mess'];

      switch ($mess)
      {
        case 'vk':

          $name = $request['name'];
          $messenger = Auth::user()->vk();
          $messengerId = $messenger->id;

          $vk = new VKApiClient();
          $token = $messenger->token;

          $vkReq = $vk->messages()->searchConversations($token, array(
            'q' => $name,
            'extended' => true,
          ));

          $count = $vkReq['count'];
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

          $dialogId = $vkReq['items'][0]['peer']['id'];
          if (Dialog::where('dialog_id', $dialogId)->count() !== 0)
          {
            return response()->json([
              'success' => false,
              'message' => 'Диалог уже добавлен',
            ], 200);
          }

          ($vkReq['items'][0]['peer']['type'] === 'chat')
            ? ([
            $name = $vkReq['items'][0]['chat_settings']['title'],
            $profiles = $vk->messages()->getChat($token, array(
              'chat_id' => $dialogId-2000000000,
              'fields' => 'photo_100',
            ))['users']
          ]) : ([
            $profiles = $vkReq['profiles'],
            $name = $profiles[0]['first_name'] . ' ' . $profiles[0]['last_name']
          ]);

          $vkReq = $vk->messages()->getHistory($token, array(
            'peer_id' => $dialogId,
            'count' => 1,
          ));
          $lastMessageId = $vkReq['items'][0]['id'];

          $dialog = new Dialog;
          $dialog->id = str_random(32);
          $dialog->name = $name;
          $dialog->dialog_id = $dialogId;
          $dialog->last_message_id = $lastMessageId;
          $dialog->messenger_id = $messengerId;
          $dialog->save();

          /**
           * Store authors.
           *
           */
          foreach ($profiles as $profile)
          {
            $id = Author::where('author_id', $profile['id'])->value('id');

            if ($id === null)
            {
              $id = str_random(32);
              $author = new Author;
              $author->id = $id;
              $author->author_id = $profile['id'];
              $author->name = $profile['first_name'] . ' ' . $profile['last_name'];
              $author->avatar = $profile['photo_100'];
              $author->save();
            }

            DB::table('author_dialog')->insert([
              'dialog_id' => $dialog->id,
              'author_id' => $id,
            ]);
          }

          return response()->json([
            'success' => true,
            'dialog' => [
              'name' => $name,
              'id' => $dialog->id,
            ]
          ], 200);
            break;

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
    public function deleteDialog(Request $request)
    {
      $id = $request['id'];
      $dialog = Dialog::find($id);

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
