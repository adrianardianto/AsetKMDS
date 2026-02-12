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
        Schema::create('stock_opname_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_period_id')->constrained('stock_opname_periods')->onDelete('cascade');
            $table->foreignId('aset_id')->constrained('asets')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('ada');
            $table->string('kondisi')->default('Baik');
            $table->text('catatan')->nullable();
            $table->timestamp('tanggal_cek')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname_records');
    }
};
