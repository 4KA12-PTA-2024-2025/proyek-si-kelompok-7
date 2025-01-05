<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SuggestionController extends Controller
{
    /**
     * Display a listing of suggestions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Mengambil semua saran dengan relasi user untuk mendapatkan informasi pengguna
        $suggestions = Suggestion::with('user:id,name')->get();

        return response()->json([
            'status' => 'success',
            'data' => $suggestions,
        ], 200);
    }

    /**
     * Store a newly created suggestion.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 400);
        }

        $suggestion = Suggestion::create($request->all());

        return response()->json(['status' => 'success', 'message' => 'Suggestion submitted successfully', 'data' => $suggestion], 201);
    }

    /**
     * Display the specified suggestion.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $suggestion = Suggestion::find($id);

        if (!$suggestion) {
            return response()->json(['status' => 'error', 'message' => 'Suggestion not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $suggestion], 200);
    }

    /**
     * Remove the specified suggestion from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $suggestion = Suggestion::find($id);

        if (!$suggestion) {
            return response()->json(['status' => 'error', 'message' => 'Suggestion not found'], 404);
        }

        $suggestion->delete();

        return response()->json(['status' => 'success', 'message' => 'Suggestion deleted successfully'], 200);
    }
}