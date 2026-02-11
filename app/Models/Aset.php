<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aset extends Model
{
    protected $fillable = [
        'nama_aset',
        'kode_aset',
        'serial_number',
        'tipe_aset',
        'kategori_aset',
        'jenis_aset',
        'harga_aset',
        'tanggal_beli',
        'umur_aset',
        'kondisi_aset',
        'nama_user',
        'lokasi',
        'keterangan',
        'waktu_pengerjaan',
    ];

    protected $casts = [
        'waktu_pengerjaan' => 'datetime',
    ];
}
