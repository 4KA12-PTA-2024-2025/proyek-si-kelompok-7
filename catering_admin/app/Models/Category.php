<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image'];

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/category/' . $this->image) : null;
    }

    public function foods()
    {
        return $this->hasMany(Food::class, 'category_id');
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['image_url'] = $this->image ? asset('storage/category/' . $this->image) : null;
        return $data;
    }

}