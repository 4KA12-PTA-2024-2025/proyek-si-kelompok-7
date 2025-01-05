<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all()->map(function ($category) {
            $category->image_url = $category->image ? Storage::disk('public')->url('category/' . $category->image) : null;
            return $category;
        });

        return response()->json(['status' => 'success', 'data' => $categories], 200);
    }

    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        $category->image_url = $category->image ? Storage::disk('public')->url('category/' . $category->image) : null;

        return response()->json(['status' => 'success', 'data' => $category], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {
            $fileName = $request->file('image')->store('category', 'public');

            $category = Category::create([
                'name' => $validated['name'],
                'image' => basename($fileName),
            ]);

            $category->image_url = Storage::disk('public')->url('category/' . $category->image);

            return response()->json([
                'status' => 'success',
                'message' => 'Category added successfully',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {
            if ($request->hasFile('image')) {
                if ($category->image && Storage::disk('public')->exists('category/' . $category->image)) {
                    Storage::disk('public')->delete('category/' . $category->image);
                }

                $fileName = $request->file('image')->store('category', 'public');
                $validated['image'] = basename($fileName);
            }

            $category->update($validated);
            $category->image_url = $category->image ? Storage::disk('public')->url('category/' . $category->image) : null;

            return response()->json(['status' => 'success', 'data' => $category], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        try {
            if ($category->image && Storage::disk('public')->exists('category/' . $category->image)) {
                Storage::disk('public')->delete('category/' . $category->image);
            }

            $category->delete();

            return response()->json(['status' => 'success', 'message' => 'Category deleted'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getFoodsByCategory($id)
    {
        $category = Category::with('foods')->find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        $foods = $category->foods->map(function ($food) {
            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;
            return $food;
        });

        return response()->json([
            'status' => 'success',
            'category' => $category->only(['id', 'name', 'image_url']),
            'foods' => $foods,
        ], 200);
    }
}