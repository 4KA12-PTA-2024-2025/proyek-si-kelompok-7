<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        try {
            $payments = Payment::with(['order', 'order.user'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil data pembayaran.',
                'data' => $payments
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve payments: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data pembayaran.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,completed,failed'
        ]);

        try {
            $payment = Payment::findOrFail($id);
            $oldStatus = $payment->payment_status;
            $newStatus = $request->payment_status;
            
            // Set payment_date when status becomes completed
            if ($newStatus === 'completed' && $oldStatus !== 'completed') {
                $payment->payment_date = now();
            }
            // Clear payment_date if status changes from completed to something else
            elseif ($oldStatus === 'completed' && $newStatus !== 'completed') {
                $payment->payment_date = null;
            }
            
            $payment->payment_status = $newStatus;
            $payment->save();

            // Update order status if payment is completed
            if ($newStatus === 'completed') {
                $order = Order::find($payment->order_id);
                if ($order) {
                    $order->status = 'processing';
                    $order->save();
                }
            }

            Log::info("Payment ID: {$id} status changed from {$oldStatus} to {$newStatus}");

            return response()->json([
                'status' => 'success',
                'message' => 'Status pembayaran berhasil diperbarui.',
                'data' => $payment
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to update payment status: ' . $e->getMessage());
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pembayaran tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui status pembayaran.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $payment = Payment::with(['order', 'order.user'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil detail pembayaran.',
                'data' => $payment
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve payment: ' . $e->getMessage());
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pembayaran tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail pembayaran.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}