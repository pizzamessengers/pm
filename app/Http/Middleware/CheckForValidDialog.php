<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Closure;

class CheckForValidDialog
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->dialog->user()->id !== Auth::id())
        {
            return response()->json([
              'success' => false,
              'message' => 'all.error.hack'
            ]);
        }

        return $next($request);
    }
}
