<?php

use App\Http\Controllers\PencatatanController;

Route::get('/', function () {
    return \Inertia\Inertia::render('Dashboard');
});

Route::get('/pencatatan', [PencatatanController::class, 'index'])->name('pencatatan.index');
Route::post('/pencatatan', [PencatatanController::class, 'store'])->name('pencatatan.store');

use App\Http\Controllers\AsetController;
Route::get('/update-aset', [AsetController::class, 'index'])->name('update-aset.index');
Route::get('/update-aset/{id}/edit', [AsetController::class, 'edit'])->name('update-aset.edit');
Route::put('/update-aset/{id}', [AsetController::class, 'update'])->name('update-aset.update');
