<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * create a new socials app.
     *
     * @return \Illuminate\Support\Facades\View
     */
    public function createSocials()
    {
      $user = Auth::user();
      $vk = $user->vk();
      $inst = $user->inst();
      $wapp = $user->wapp();
      return view('socials', [
        'apiToken' => $user->api_token,
        'socials' => [
          'vk' => $vk !== null ? [
            'id' => $vk->id,
            'watching' => $vk->watching,
            'dialogList' => $vk->dialogs()->get(['id', 'name', 'updating']),
          ] : null,
          'inst' => $inst !== null ? [
            'id' => $inst->id,
            'watching' => $inst->watching,
            'dialogList' => $inst->dialogs()->get(['id', 'name', 'updating']),
          ] : null,
          'wapp' => $wapp !== null ? [
            'id' => $wapp->id,
            'watching' => $wapp->watching,
            'dialogList' => $wapp->dialogs()->get(['id', 'name', 'updating']),
          ] : null,
        ],
      ]);
    }
}
