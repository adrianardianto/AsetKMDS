<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\RiwayatAset;
use Inertia\Inertia;

class RiwayatAsetController extends Controller
{
    public function index(Request $request)
    {
        $query = RiwayatAset::with(['user', 'aset']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('aset', function ($q) use ($search) {
                    $q->where('nama_aset', 'like', "%{$search}%")
                      ->orWhere('kode_aset', 'like', "%{$search}%");
                })
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        $riwayat = $query->latest()->get();

        return Inertia::render('RiwayatAset/Index', [
            'riwayat' => $riwayat,
            'filters' => $request->only(['search', 'start_date', 'end_date', 'action']),
        ]);
    }
}
