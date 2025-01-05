<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        try {
            $stocks = Stock::all();
            
            return response()->json([
                'status' => 'success',
                'data' => $stocks
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve stocks: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $stock = Stock::find($id);

            if (!$stock) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stock not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $stock
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0'
        ]);

        try {
            $stock = Stock::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock created successfully',
                'data' => $stock
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $stock = Stock::find($id);

        if (!$stock) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stock not found'
            ], 404);
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0'
        ]);

        try {
            $stock->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock updated successfully',
                'data' => $stock
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $stock = Stock::find($id);

            if (!$stock) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stock not found'
                ], 404);
            }

            $stock->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Stock deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete stock: ' . $e->getMessage()
            ], 500);
        }
    }
}