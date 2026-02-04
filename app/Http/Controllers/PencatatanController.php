<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PencatatanController extends Controller
{
    /**
     * Display the asset recording form.
     */
    public function index()
    {
        return Inertia::render('Pencatatan/Index');
    }

    /**
     * Store a newly created asset in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_aset' => 'required|string|max:255',
            'kode_aset' => 'required|string|max:255|unique:asets,kode_aset',
            'serial_number' => 'required|string|max:255',
            'tipe_aset' => 'required|string|max:255',
            'kategori_aset' => 'required|string|max:255',
            'jenis_aset' => 'required|string|max:255',
            'harga_aset' => 'required', 
            'tanggal_beli' => 'required|date',
            'umur_aset' => 'required|integer|min:0',
            'kondisi_aset' => 'required|string|max:255',
            'nama_user' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        // Remove dots (thousands separator)
        $hargaClean = str_replace('.', '', $request->harga_aset);
        // Replace comma with dot (decimal separator)
        $hargaClean = str_replace(',', '.', $hargaClean);
        
        $validated['harga_aset'] = $hargaClean;

        Aset::create($validated);

        return redirect()->route('pencatatan.index')->with('success', 'Aset berhasil dicatat.');
    }
}
