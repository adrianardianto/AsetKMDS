<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpnamePeriod extends Model
{
    protected $fillable = [
        'judul',
        'keterangan',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    public function records()
    {
        return $this->hasMany(StockOpnameRecord::class);
    }
}
