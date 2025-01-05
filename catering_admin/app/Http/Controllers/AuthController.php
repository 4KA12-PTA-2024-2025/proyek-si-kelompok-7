<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'forgotPassword', 'resetPassword']]);
    }

    /**
     * Register a new user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register()
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string|max:50',
            'alamat'=> 'required|string|max:255',
            'telephone'=> 'required|string|max:15',
            'email' => 'required|string|email|max:25|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }        

        $user = User::create([
            'name' => request('name'),
            'alamat' => request('alamat'),
            'telephone' => request('telephone'),
            'email' => request('email'),
            'password' => Hash::make(request('password'))
        ]);

        if ($user) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pendaftaran Berhasil'
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Pendaftaran gagal'
            ], 500);
        }
    }

    /**
     * Handle forgot password request
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword()
    {
        $validator = Validator::make(request()->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $email = request('email');
        
        // Check if user exists
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Email terdaftar. Silakan lanjutkan ke halaman reset password.'
        ], 200);
    }

    /**
     * Handle reset password request
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword()
    {
        $validator = Validator::make(request()->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        try {
            $user = User::where('email', request('email'))->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email tidak ditemukan.'
                ], 404);
            }

            // Update password
            $user->password = Hash::make(request('password'));
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password berhasil diubah!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengubah password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Password anda salah'], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login Berhasil',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ], 200);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $newToken = JWTAuth::refresh();
        return $this->respondWithToken($newToken);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $expiresIn = config('jwt.ttl') * 60;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $expiresIn
        ]);
    }

    /**
     * Update the user's profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile()
    {
        $user = auth()->user();

        $validator = Validator::make(request()->all(), [
            'name' => 'sometimes|required|string|max:50',
            'alamat' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        try {
            $user->update(request()->only('name', 'alamat', 'telephone'));

            return response()->json([
                'status' => 'success',
                'message' => 'Profil berhasil diperbarui',
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui profil: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all users (accessible by authenticated users).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUsers()
    {
        // Fetch all users
        $users = User::all();

        return response()->json([
            'status' => 'success',
            'message' => 'Data semua user berhasil diambil.',
            'data' => $users
        ], 200);
    }

}