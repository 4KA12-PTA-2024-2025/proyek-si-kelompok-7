<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods';

    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'gambar',
        'category_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function getGambarUrlAttribute()
    {
        return $this->gambar ? asset('storage/foods/' . $this->gambar) : null;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Define the inverse relationship with ShoppingCart
    public function shoppingCarts()
    {
        return $this->hasMany(ShoppingCart::class);
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['gambar_url'] = $this->gambar ? asset('storage/foods/' . $this->gambar) : null;
        return $data;
    }
}