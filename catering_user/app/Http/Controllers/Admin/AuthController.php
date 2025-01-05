<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin-api', ['except' => [
            'login',
            'register',
            'forgotPassword',
            'resetPassword'
        ]]);
    }

    public function register()
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:50|unique:admins',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }        

        try {
            $admin = Admin::create([
                'name' => request('name'),
                'email' => request('email'),
                'password' => Hash::make(request('password'))
            ]);

            if (!$admin) {
                throw new \Exception('Failed to create admin account');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Admin registration successful'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login()
    {
        $validator = Validator::make(request()->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 400);
        }

        $credentials = request(['email', 'password']);

        if (!$token = auth('admin-api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        return $this->respondWithToken($token);
    }

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
        
        try {
            $admin = Admin::where('email', $email)->first();
            
            if (!$admin) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Email is registered. Please proceed to reset password page.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error processing request: ' . $e->getMessage()
            ], 500);
        }
    }

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
            $admin = Admin::where('email', request('email'))->first();

            if (!$admin) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email not found.'
                ], 404);
            }

            $admin->password = Hash::make(request('password'));
            $admin->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password successfully changed!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error changing password: ' . $e->getMessage()
            ], 500);
        }
    }

    public function me()
    {
        return response()->json(auth('admin-api')->user());
    }

    public function logout()
    {
        try {
            auth('admin-api')->logout();

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error during logout: ' . $e->getMessage()
            ], 500);
        }
    }

    public function refresh()
    {
        try {
            return $this->respondWithToken(auth('admin-api')->refresh());
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error refreshing token: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ]);
    }

    /**
     * Get all users data (admin only)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUsers()
    {
        try {
            $users = User::select([
                'id',
                'name',
                'email',
                'alamat',
                'telephone',
                'created_at',
                'updated_at',
                'email_verified_at'
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                $user->status = $user->email_verified_at ? 'Verified' : 'Unverified';
                $user->role = 'customer';
                return $user;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully retrieved all users',
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }
}