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
        Schema::table('stock_opname_records', function (Blueprint $table) {
            $table->string('snapshot_nama_aset')->nullable()->after('lokasi');
            $table->string('snapshot_kode_aset')->nullable()->after('snapshot_nama_aset');
            $table->string('snapshot_serial_number')->nullable()->after('snapshot_kode_aset');
            $table->date('snapshot_tanggal_beli')->nullable()->after('snapshot_serial_number');
            $table->decimal('snapshot_harga_aset', 15, 2)->nullable()->after('snapshot_tanggal_beli');
            $table->string('snapshot_kondisi_aset')->nullable()->after('snapshot_harga_aset');
            $table->string('snapshot_lokasi')->nullable()->after('snapshot_kondisi_aset');
            $table->boolean('is_snapshot_only')->default(false)->after('snapshot_lokasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_opname_records', function (Blueprint $table) {
            $table->dropColumn([
                'snapshot_nama_aset',
                'snapshot_kode_aset',
                'snapshot_serial_number',
                'snapshot_tanggal_beli',
                'snapshot_harga_aset',
                'snapshot_kondisi_aset',
                'snapshot_lokasi',
                'is_snapshot_only',
            ]);
        });
    }
};
