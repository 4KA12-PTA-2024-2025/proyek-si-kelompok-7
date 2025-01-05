<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Food;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function storeDirect(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:15',
            'food_id' => 'required|exists:foods,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda harus login terlebih dahulu'
                ], 401);
            }

            DB::beginTransaction();

            $food = Food::findOrFail($validated['food_id']);
            $quantity = $validated['quantity'];
            $subtotal = $food->harga * $quantity;

            $order = Order::create([
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'food_name' => $food->nama,
                'quantity' => $quantity,
                'total_amount' => $subtotal,
                'status' => 'pending'
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan langsung berhasil dibuat.',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeFromCart(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:15',
        ]);

        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda harus login terlebih dahulu'
                ], 401);
            }

            DB::beginTransaction();

            $cartItems = ShoppingCart::where('user_id', Auth::id())
                ->with('food')
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Keranjang belanja kosong.'
                ], 400);
            }

            $totalAmount = 0;
            $foodNames = [];
            $totalQuantity = 0;

            foreach ($cartItems as $item) {
                $food = Food::findOrFail($item->food_id);
                $subtotal = $item->jumlah * $food->harga;
                $totalAmount += $subtotal;
                $foodNames[] = "{$food->nama} (x{$item->jumlah})"; // Include quantity in food name
                $totalQuantity += $item->jumlah;
            }

            $order = Order::create([
                'user_id' => Auth::id(),
                'name' => $validated['name'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'food_name' => implode(', ', $foodNames),
                'quantity' => $totalQuantity, // Add total quantity from cart
                'total_amount' => $totalAmount,
                'status' => 'pending',
            ]);

            // Clear the cart after successful order
            ShoppingCart::where('user_id', Auth::id())->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan dari keranjang berhasil dibuat.',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            // Pastikan user sudah login
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda harus login terlebih dahulu'
                ], 401);
            }

            $orders = Order::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil data pesanan.',
                'data' => $orders
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve orders: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda harus login terlebih dahulu'
                ], 401);
            }

            $order = Order::where('user_id', Auth::id())
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil detail pesanan.',
                'data' => $order
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve order: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan tidak ditemukan.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda harus login terlebih dahulu'
                ], 401);
            }

            $order = Order::findOrFail($id);

            if ($order->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $order->status = $request->status;
            $order->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Status pesanan berhasil diperbarui.',
                'data' => $order
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to update order status: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui status pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}