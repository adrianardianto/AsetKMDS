<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Aset;
use App\Models\RiwayatAset;
use Inertia\Inertia;

class AsetController extends Controller
{
    public function index(Request $request)
    {
        $query = Aset::query();

        // Comprehensive Filtering
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_aset', 'like', "%{$search}%")
                  ->orWhere('kode_aset', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%")
                  ->orWhere('nama_user', 'like', "%{$search}%");
            });
        }

        if ($request->filled('tipe')) {
            $query->where('tipe_aset', $request->tipe);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori_aset', $request->kategori);
        }

        if ($request->filled('jenis')) {
            $query->where('jenis_aset', $request->jenis);
        }


        if ($request->filled('kondisi')) {
            $query->where('kondisi_aset', $request->kondisi);
        }

        $asets = $query->latest()->get();

        return Inertia::render('UpdateAset/Index', [
            'asets' => $asets,
            'filters' => $request->only(['search', 'tipe', 'kategori', 'jenis', 'kondisi']),
        ]);
    }

    public function edit($id)
    {
        $aset = Aset::findOrFail($id);
        return Inertia::render('UpdateAset/Edit', [
            'aset' => $aset
        ]);
    }

    public function update(Request $request, $id)
    {
        $aset = Aset::findOrFail($id);

        $validated = $request->validate([
            'nama_aset' => 'required|string|max:255',
            'kode_aset' => 'required|string|max:255|unique:asets,kode_aset,' . $id,
            'serial_number' => 'nullable|string|max:255|unique:asets,serial_number,' . $id,
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

      
        $hargaClean = str_replace('.', '', $request->harga_aset);
        $hargaClean = str_replace(',', '.', $hargaClean);
        
        $validated['harga_aset'] = $hargaClean;


       
        $originalData = $aset->getOriginal();
        
        $aset->fill($validated);
        
        if ($aset->isDirty()) {
            $changes = [];
            foreach ($aset->getDirty() as $key => $value) {
                $originalValue = $originalData[$key] ?? null;
                if ($originalValue !== $value) {
                    $changes[$key] = [
                        'old' => $originalValue,
                        'new' => $value,
                    ];
                }
            }

            $aset->save();

            if (!empty($changes)) {
                $changedFields = collect(array_keys($changes))
                    ->map(function ($field) {
                        return ucwords(str_replace('_', ' ', $field));
                    })
                    ->implode(', ');
                    
                RiwayatAset::create([
                    'aset_id' => $aset->id,
                    'user_id' => auth()->id(),
                    'action' => 'UPDATE',
                    'changes' => $changes,
                    'description' => 'Memperbarui data: ' . $changedFields,
                ]);
            }
        } else {
             $aset->save();
        }


        return redirect()->route('update-aset.index')->with('success', 'Data aset berhasil diperbarui.');
    }
}
