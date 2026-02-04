<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asets', function (Blueprint $table) {
            $table->id();
            $table->string('nama_aset');
            $table->string('kode_aset')->unique();
            $table->string('serial_number');
            $table->string('tipe_aset');
            $table->string('kategori_aset');
            $table->string('jenis_aset');
            $table->decimal('harga_aset', 15, 2);
            $table->date('tanggal_beli');
            $table->integer('umur_aset');
            $table->string('kondisi_aset');
            $table->string('nama_user');
            $table->string('lokasi');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asets');
    }
};
