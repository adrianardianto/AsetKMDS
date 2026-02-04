<?php

use App\Http\Controllers\PencatatanController;

Route::get('/', function () {
    return \Inertia\Inertia::render('Dashboard');
});

Route::get('/pencatatan', [PencatatanController::class, 'index'])->name('pencatatan.index');
Route::post('/pencatatan', [PencatatanController::class, 'store'])->name('pencatatan.store');
