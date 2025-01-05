<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    use HasFactory;

    protected $table = 'shopping_carts';

    protected $fillable = [
        'user_id',
        'food_id',
        'nama_menu',
        'jumlah',
        'harga_total',
        'harga_satuan',
    ];

    // Define the relationship with Food
    public function food()
    {
        return $this->belongsTo(Food::class, 'food_id');

    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}