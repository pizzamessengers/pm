<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use JavaScript;
use App\Dialog;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
     protected $redirectTo = '/socials';

     /**
      * Show the application dashboard.
      *
      * @return \Illuminate\Http\Response
      */
     public function index()
     {
         return view('welcome');
     }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        $user = $this->guard()->user();

        if($this->authenticated($request, $user)) {

            return response()->json([
                'user' => [
                    'isAuth' => true,
                    'name' => Auth::user()->name,
                    'apiToken' => Auth::user()->api_token,
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
                ],
                'success' => true,
                'redirect' => $this->redirectPath(),
            ], 200);
        }
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        return true;
    }

    /**
     * Get the failed login response instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => trans('auth.failed')
        ], 422);
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $this->guard()->logout();

        $request->session()->invalidate();

        return response()->json([
          'success' => true,
        ], 200);
    }
}
