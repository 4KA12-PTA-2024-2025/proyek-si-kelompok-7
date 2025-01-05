<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StockController;

// Public Routes (tanpa autentikasi)
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/foods', [CategoryController::class, 'getFoodsByCategory']);
Route::get('/foods/{id}', [FoodController::class, 'show']);

// Suggestion Routes (Public & Protected)
Route::controller(SuggestionController::class)->group(function () {
    // Public routes untuk melihat saran
    Route::get('/suggestions', 'index');
    Route::get('/suggestions/{id}', 'show');

    // Protected routes untuk membuat dan menghapus saran
    Route::middleware('auth:api')->group(function () {
        Route::post('/suggestions', 'store');
        Route::delete('/suggestions/{id}', 'destroy');
    });
});

// Auth Routes
Route::group(['middleware' => 'api', 'prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    Route::put('update-profile', [AuthController::class, 'updateProfile'])->middleware('auth:api');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Protected Routes (memerlukan autentikasi)
Route::group(['middleware' => 'auth:api'], function () {
    // Shopping Cart Routes
    Route::get('/cart', [ShoppingCartController::class, 'index']);
    Route::post('/cart', [ShoppingCartController::class, 'store']);
    Route::put('/cart/{id}', [ShoppingCartController::class, 'update']);
    Route::delete('/cart/{id}', [ShoppingCartController::class, 'destroy']);

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/direct', [OrderController::class, 'storeDirect']);
    Route::post('/orders/cart', [OrderController::class, 'storeFromCart']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Payment Routes
    Route::post('/payments/{orderId}', [PaymentController::class, 'createPayment']);
    Route::post('/payments/callback', [PaymentController::class, 'callback'])->name('payments.callback');
    Route::get('/payments/success', [PaymentController::class, 'return'])->name('payments.return');
});

// Admin Auth Routes
Route::group(['prefix' => 'admin', 'namespace' => 'Admin'], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('register', [App\Http\Controllers\Admin\AuthController::class, 'register']);
        Route::post('login', [App\Http\Controllers\Admin\AuthController::class, 'login']);
        Route::post('forgot-password', [App\Http\Controllers\Admin\AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [App\Http\Controllers\Admin\AuthController::class, 'resetPassword']);

        // Protected admin routes
        Route::group(['middleware' => 'auth:admin-api'], function () {
            Route::post('logout', [App\Http\Controllers\Admin\AuthController::class, 'logout']);
            Route::post('refresh', [App\Http\Controllers\Admin\AuthController::class, 'refresh']);
            Route::post('me', [App\Http\Controllers\Admin\AuthController::class, 'me']);
        });
    });
});

// Admin Food Management Routes (requires admin-only middleware)
Route::group(['middleware' => 'admin-only'], function () {
    // User Routes
    Route::get('/users', [AuthController::class, 'getAllUsers']);

    // Food Routes
    Route::post('/foods', [FoodController::class, 'store']);
    Route::put('/foods/{id}', [FoodController::class, 'update']);
    Route::delete('/foods/{id}', [FoodController::class, 'destroy']);

    // Category Routes
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

// Admin Management Routes (requires admin-only middleware)
Route::group(['prefix' => 'admin', 'middleware' => ['auth:admin-api']], function () {
    // User Management Routes
    Route::get('/users', [App\Http\Controllers\Admin\AuthController::class, 'getAllUsers']);
    
    // Order Routes
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index']);
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus']);

    // Payment Routes
    Route::get('/payments', [App\Http\Controllers\Admin\PaymentController::class, 'index']);
    Route::get('/payments/{id}', [App\Http\Controllers\Admin\PaymentController::class, 'show']);
    Route::put('/payments/{id}/status', [App\Http\Controllers\Admin\PaymentController::class, 'updateStatus']);

    // Stock Management
    Route::get('/stocks', [StockController::class, 'index']);
    Route::get('/stocks/{id}', [StockController::class, 'show']);
    Route::post('/stocks', [StockController::class, 'store']);
    Route::put('/stocks/{id}', [StockController::class, 'update']);
    Route::delete('/stocks/{id}', [StockController::class, 'destroy']);
});