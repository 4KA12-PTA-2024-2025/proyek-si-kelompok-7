<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Food::with('category')->get()->map(function ($food) {
            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;
            return $food;
        });

        return response()->json(['status' => 'success', 'data' => $foods], 200);
    }

    public function show($id)
    {
        $food = Food::with('category')->find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

        return response()->json(['status' => 'success', 'data' => $food], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|integer|min:1',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'category_id' => 'required|exists:categories,id',
        ]);

        try {
            $fileName = $request->hasFile('gambar')
                ? $request->file('gambar')->store('foods', 'public')
                : null;

            $food = Food::create([
                'nama' => $validated['nama'],
                'deskripsi' => $validated['deskripsi'],
                'harga' => $validated['harga'],
                'gambar' => $fileName ? basename($fileName) : null,
                'category_id' => $validated['category_id'],
            ]);

            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

            return response()->json([
                'status' => 'success',
                'message' => 'Food added successfully',
                'data' => $food,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            if ($request->hasFile('gambar')) {
                // Delete old image if exists
                if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
                    Storage::disk('public')->delete('foods/' . $food->gambar);
                }

                // Store new image
                $fileName = time() . '_' . $request->file('gambar')->getClientOriginalName();
                $request->file('gambar')->storeAs('foods', $fileName, 'public');
                $food->gambar = $fileName;
            }

            // Update other fields
            $food->nama = $validated['nama'];
            $food->deskripsi = $validated['deskripsi'];
            $food->harga = $validated['harga'];
            $food->category_id = $validated['category_id'];

            $food->save();
            
            // Refresh and add image URL
            $food->refresh();
            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

            return response()->json([
                'status' => 'success',
                'message' => 'Food updated successfully',
                'data' => $food,
            ], 200);
        } catch (\Exception $e) {
            // Rollback new image if update fails
            if (isset($fileName) && Storage::disk('public')->exists('foods/' . $fileName)) {
                Storage::disk('public')->delete('foods/' . $fileName);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        try {
            // Delete image file if exists
            if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
                Storage::disk('public')->delete('foods/' . $food->gambar);
            }

            $food->delete();

            return response()->json(['status' => 'success', 'message' => 'Food deleted'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}