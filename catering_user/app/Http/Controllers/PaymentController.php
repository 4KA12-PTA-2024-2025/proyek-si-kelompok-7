<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function createPayment(Request $request, $orderId)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,completed,failed',
        ]);

        try {
            DB::beginTransaction();

            $order = Order::findOrFail($orderId);

            // Create payment with current timestamp when status is completed
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_date' => $validated['status'] === 'completed' ? now() : null,
                'payment_status' => $validated['status'],
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran berhasil dibuat.',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat pembayaran.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}