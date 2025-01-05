<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsAppNotificationService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }
    
    public function index()
    {
        try {
            $orders = Order::with(['user', 'payment'])
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
            $order = Order::with(['user', 'payment'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil mengambil detail pesanan.',
                'data' => $order
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve order: ' . $e->getMessage());
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        try {
            $order = Order::findOrFail($id);
            $oldStatus = $order->status;
            $order->status = $request->status;
            $order->save();

            // Kirim notifikasi WhatsApp jika status berubah menjadi completed
            if ($request->status === 'completed' && $oldStatus !== 'completed') {
                $this->whatsappService->sendOrderCompletedNotification($order);
            }

            // Log status change
            Log::info("Order ID: {$id} status changed from {$oldStatus} to {$request->status}");

            return response()->json([
                'status' => 'success',
                'message' => 'Status pesanan berhasil diperbarui.',
                'data' => $order
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to update order status: ' . $e->getMessage());
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui status pesanan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}