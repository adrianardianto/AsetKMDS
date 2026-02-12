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
        'lokasi',
        'nama_user',
        'tanggal_cek',
        'snapshot_nama_aset',
        'snapshot_kode_aset',
        'snapshot_serial_number',
        'snapshot_tanggal_beli',
        'snapshot_harga_aset',
        'snapshot_kondisi_aset',
        'snapshot_lokasi',
        'snapshot_nama_user',
        'is_snapshot_only',
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
