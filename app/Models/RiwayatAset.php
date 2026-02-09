<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatAset extends Model
{
    protected $fillable = [
        'user_id',
        'aset_id',
        'action',
        'changes',
        'description',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aset()
    {
        return $this->belongsTo(Aset::class);
    }
}
