<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use JavaScript;
use App\Messenger;
use App\Dialog;

class User
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $isAuth = Auth::guard($guard)->check();
        $user = Auth::user();
        $isAuth ? ([
          $vk = $user->vk(),
          $inst = $user->inst(),
          $wapp = $user->wapp(),
          JavaScript::put([
              'isAuth' => true,
              'name' => $user->name,
              'apiToken' => $user->api_token,
              'csrf' => csrf_token(),
              'socials' => [
                'vk' => $vk === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => $vk->dialogs()->get(['id', 'name', 'updating']),
                ],
                'inst' => $inst === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => $inst->dialogs()->get(['id', 'name', 'updating']),
                ],
                'wapp' => $wapp === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => $wapp->dialogs()->get(['id', 'name', 'updating']),
                ],
              ],
          ])
        ]) : (
          JavaScript::put([
              'isAuth' => false,
              'name' => null,
              'apiToken' => null,
              'csrf' => csrf_token(),
              'socials' => [
                'vk' => [],
                'inst' => [],
                'wapp' => [],
              ],
          ])
        );

        return $next($request);
    }
}
