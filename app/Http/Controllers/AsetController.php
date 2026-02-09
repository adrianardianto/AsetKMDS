<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Aset;
use App\Models\RiwayatAset;
use Inertia\Inertia;

class AsetController extends Controller
{
    public function index()
    {
        $asets = Aset::latest()->get();
        return Inertia::render('UpdateAset/Index', [
            'asets' => $asets
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

        // Remove dots (thousands separator)
        $hargaClean = str_replace('.', '', $request->harga_aset);
        // Replace comma with dot (decimal separator)
        $hargaClean = str_replace(',', '.', $hargaClean);
        
        $validated['harga_aset'] = $hargaClean;


        // Capture original data before update
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
                    'user_id' => auth()->id(), // Assuming auth is working
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
