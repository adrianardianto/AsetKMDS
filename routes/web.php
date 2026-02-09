<?php

use App\Http\Controllers\PencatatanController;

Route::get('/', function () {
    return \Inertia\Inertia::render('Dashboard');
});

Route::get('/pencatatan', [PencatatanController::class, 'index'])->name('pencatatan.index');
Route::post('/pencatatan', [PencatatanController::class, 'store'])->name('pencatatan.store');
Route::get('/pencatatan/generate-kode', [PencatatanController::class, 'generateKode'])->name('pencatatan.generate-kode');

use App\Http\Controllers\AsetController;
Route::get('/update-aset', [AsetController::class, 'index'])->name('update-aset.index');
Route::get('/update-aset/{id}/edit', [AsetController::class, 'edit'])->name('update-aset.edit');
Route::put('/update-aset/{id}', [AsetController::class, 'update'])->name('update-aset.update');

use App\Http\Controllers\RiwayatAsetController;
Route::get('/riwayat-aset', [RiwayatAsetController::class, 'index'])->name('riwayat-aset.index');

use App\Http\Controllers\StockOpnameController;
Route::get('/stock-opname', [StockOpnameController::class, 'index'])->name('stock-opname.index');
