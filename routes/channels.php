<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('messages.{dialog}', function ($user, App\Dialog $dialog) {
    return $user->id === $dialog->user()->id;
});

Broadcast::channel('{token}.crm', function ($user, string $token) {
    return $user->api_token === $token;
});
