<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockOpnameController extends Controller
{

    public function index()
    {
        return Inertia::render('StockOpname/Index');
    }
}
