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
        $isAuth ? (
          JavaScript::put([
              'isAuth' => true,
              'name' => $user->name,
              'apiToken' => $user->api_token,
              'csrf' => csrf_token(),
              'socials' => [
                'vk' => $user->vk === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => Dialog::where(
                    'messenger_id',
                    $user->vk
                  )->get(['id', 'name', 'updating']),
                ],
                'inst' => $user->inst === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => Dialog::where(
                    'messenger_id',
                    $user->inst
                  )->get(['id', 'name', 'updating']),
                ],
                'wapp' => $user->wapp === null ? [
                  'connected' => false,
                  'dialogs' => [],
                ] : [
                  'connected' => true,
                  'dialogs' => Dialog::where(
                    'messenger_id',
                    $user->wapp
                  )->get(['id', 'name', 'updating']),
                ],
              ],
          ])
        ) : (
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
