<?php

namespace App\Services;

use Twilio\Rest\Client;
use App\Models\Order;
use Carbon\Carbon;

class WhatsAppNotificationService
{
    protected $client;
    protected $fromNumber;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.auth_token')
        );
        $this->fromNumber = config('services.twilio.whatsapp_from');
    }

    public function sendOrderCompletedNotification(Order $order)
    {
        // Format tanggal ke Bahasa Indonesia
        setlocale(LC_TIME, 'id_ID');
        Carbon::setLocale('id');
        
        $orderDate = Carbon::parse($order->created_at)->isoFormat('dddd, D MMMM Y HH:mm');
        
        // Memformat detail menu pesanan
        $orderDetails = $this->formatOrderDetails($order);
        
        $message = "✅ *Pesanan Anda Telah Selesai!*\n\n"
                . "📋 *Detail Pesanan:*\n"
                . "====================\n"
                . "📅 Tanggal Order: {$orderDate}\n"
                . "👤 Nama: {$order->name}\n"
                . "📍 Alamat: {$order->address}\n\n"
                . "🍽️ *Menu Pesanan:*\n"
                . $orderDetails
                . "📦 Total Item: {$order->quantity}\n"
                . "💰 Total Harga: Rp " . number_format($order->total_amount, 0, ',', '.') . "\n"
                . "====================\n\n"
                . "Terima kasih telah memesan di restoran kami! 🙏\n"
                . "Semoga makanannya enak dan memuaskan! 😊";

        try {
            // Format nomor telepon (menghilangkan awalan 0 dan +)
            $phoneNumber = $this->formatPhoneNumber($order->phone);

            $this->client->messages->create(
                "whatsapp:+{$phoneNumber}",
                [
                    'from' => $this->fromNumber,
                    'body' => $message
                ]
            );
            
            \Log::info('WhatsApp notification sent successfully to order #' . $order->id);
            return true;
            
        } catch (\Exception $e) {
            \Log::error('WhatsApp notification failed for order #' . $order->id . ': ' . $e->getMessage());
            return false;
        }
    }

    protected function formatOrderDetails(Order $order)
    {
        $foodItems = explode(', ', $order->food_name);
        $orderDetails = '';

        // Check if this is a multi-item order
        if (strpos($order->food_name, '(x') !== false) {
            // Cart order with multiple items
            foreach ($foodItems as $index => $item) {
                // Extract item name and quantity from format "Item Name (x2)"
                preg_match('/(.+?) \(x(\d+)\)$/', $item, $matches);
                if (count($matches) === 3) {
                    $itemName = trim($matches[1]);
                    $itemQty = $matches[2];
                    $orderDetails .= sprintf("   %d. %s (%d pcs)\n", $index + 1, $itemName, $itemQty);
                }
            }
        } else {
            // Direct order with single item
            $orderDetails = sprintf("   • %s (%d pcs)\n", $order->food_name, $order->quantity);
        }

        return $orderDetails . "\n";
    }

    protected function formatPhoneNumber($phone)
    {
        $phone = trim($phone);
        
        if (substr($phone, 0, 1) === '0') {
            return '62' . substr($phone, 1);
        }
        
        if (substr($phone, 0, 1) === '+') {
            return substr($phone, 1);
        }
        
        return $phone;
    }
}