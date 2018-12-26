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
          $dialogData['messenger_id'] = $messenger->id;

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

          $dialogData['dialog_id'] = $vkReq['items'][0]['peer']['id'];
          if (Dialog::where('dialog_id', $dialogData['dialog_id'])->count() !== 0)
          {
            return response()->json([
              'success' => false,
              'message' => 'Диалог уже добавлен',
            ], 200);
          }

          ($vkReq['items'][0]['peer']['type'] === 'chat')
            ? ([
            $dialogData['name'] = $vkReq['items'][0]['chat_settings']['title'],
            $profiles = $vk->messages()->getChat($token, array(
              'chat_id' => $dialogData['dialog_id']-2000000000,
              'fields' => 'photo_100',
            ))['users']
          ]) : ([
            $profiles = $vkReq['profiles'],
            $dialogData['name'] = $profiles[0]['first_name'] . ' ' . $profiles[0]['last_name']
          ]);

          $vkReq = $vk->messages()->getHistory($token, array(
            'peer_id' => $dialogData['dialog_id'],
            'count' => 1,
          ));
          $dialogData['last_message_id'] = $vkReq['items'][0]['id'];

          $dialog = Dialog::create($dialogData);

          /**
           * Store authors.
           *
           */
          foreach ($profiles as $profile)
          {
            $authorId = Author::where('author_id', $profile['id'])->value('id');

            if ($authorId === null)
            {
              $author = new Author;
              $author->author_id = $profile['id'];
              $author->name = $profile['first_name'] . ' ' . $profile['last_name'];
              $author->avatar = $profile['photo_100'];
              $author->save();

              $authorId = $author->id;
            }

            DB::table('author_dialog')->insert([
              'dialog_id' => $dialog->id,
              'author_id' => $authorId,
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
