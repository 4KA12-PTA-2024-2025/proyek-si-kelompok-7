<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use App\Models\Food;

class ShoppingCartController extends Controller
{
    /**
     * Display a listing of the shopping cart items.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cartItems = ShoppingCart::where('user_id', auth()->id())->get();
        return response()->json(['status' => 'success', 'data' => $cartItems], 200);
    }

    /**
     * Store a newly created shopping cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
            'jumlah' => 'required|integer|min:1'
        ]);

        try {
            // Ambil data makanan dari database
            $food = Food::findOrFail($validated['food_id']);

            // Cek apakah item sudah ada di keranjang pengguna
            $existingItem = ShoppingCart::where('user_id', auth()->id())
                ->where('food_id', $food->id)
                ->first();

            if ($existingItem) {
                // Jika sudah ada, tambahkan jumlah dan perbarui harga total
                $existingItem->jumlah += $validated['jumlah'];
                $existingItem->harga_total = $existingItem->jumlah * $food->harga;
                $existingItem->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Item quantity updated in cart',
                    'data' => $existingItem
                ], 200);
            }

            // Jika belum ada, tambahkan item baru ke keranjang
            $cartItem = ShoppingCart::create([
                'user_id' => auth()->id(),
                'food_id' => $food->id,
                'nama_menu' => $food->nama,
                'jumlah' => $validated['jumlah'],
                'harga_satuan' => $food->harga,
                'harga_total' => $food->harga * $validated['jumlah']
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Item added to cart successfully',
                'data' => $cartItem
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified shopping cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Cart item not found'], 404);
        }

        $validated = $request->validate([
            'jumlah' => 'sometimes|integer|min:1',
            'food_id' => 'sometimes|exists:foods,id',
        ]);

        if (isset($validated['jumlah'])) {
            $validated['harga_total'] = $cartItem->harga_satuan * $validated['jumlah'];
        }

        $cartItem->update($validated);

        return response()->json(['status' => 'success', 'data' => $cartItem], 200);
    }

    /**
     * Remove the specified shopping cart item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cartItem = ShoppingCart::where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$cartItem) {
            return response()->json(['status' => 'error', 'message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['status' => 'success', 'message' => 'Cart item deleted'], 200);
    }
}