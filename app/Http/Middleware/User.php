<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use JavaScript;

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
        $isAuth ? (
          JavaScript::put([
              'isAuth' => true,
              'name' => Auth::user()->name,
              'apiToken' => Auth::user()->api_token,
              'csrf' => csrf_token(),
              'socials' => [
                'vk' => Auth::user()->vk === null
                  ? false : true,
                'inst' => Auth::user()->inst === null
                  ? false : true,
                'wapp' => Auth::user()->wapp === null
                  ? false : true,
              ],
          ])
        ) : (
          JavaScript::put([
              'isAuth' => false,
              'name' => null,
              'apiToken' => null,
              'csrf' => csrf_token(),
              'socials' => [],
          ])
        );

        return $next($request);
    }
}
