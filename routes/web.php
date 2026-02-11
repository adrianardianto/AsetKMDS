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
Route::get('/update-aset/export', [AsetController::class, 'export'])->name('update-aset.export');
Route::get('/update-aset/{id}/edit', [AsetController::class, 'edit'])->name('update-aset.edit');
Route::put('/update-aset/{id}', [AsetController::class, 'update'])->name('update-aset.update');

use App\Http\Controllers\RiwayatAsetController;
Route::get('/riwayat-aset', [RiwayatAsetController::class, 'index'])->name('riwayat-aset.index');

use App\Http\Controllers\StockOpnameController;
Route::get('stock-opname/{id}/action', [StockOpnameController::class, 'action'])->name('stock-opname.action');
Route::post('stock-opname/{id}/complete', [StockOpnameController::class, 'complete'])->name('stock-opname.complete');
Route::post('stock-opname/record', [StockOpnameController::class, 'updateRecord'])->name('stock-opname.update-record');
Route::resource('stock-opname', StockOpnameController::class);
