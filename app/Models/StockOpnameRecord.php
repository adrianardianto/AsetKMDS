<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpnameRecord extends Model
{
    protected $fillable = [
        'stock_opname_period_id',
        'aset_id',
        'user_id',
        'status',
        'kondisi',
        'catatan',
        'tanggal_cek',
    ];

    public function period()
    {
        return $this->belongsTo(StockOpnamePeriod::class, 'stock_opname_period_id');
    }

    public function aset()
    {
        return $this->belongsTo(Aset::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
