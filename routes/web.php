<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return \Inertia\Inertia::render('Dashboard');
});

Route::get('/pencatatan', function () {
    return \Inertia\Inertia::render('Pencatatan/Index');
});
