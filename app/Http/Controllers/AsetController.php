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
            'waktu_pengerjaan' => 'nullable|date|required_if:use_auto_time,false',
            'use_auto_time' => 'boolean',
        ]);
        
        $hargaClean = str_replace('.', '', $request->harga_aset);
        $hargaClean = str_replace(',', '.', $hargaClean);
        
        $validated['harga_aset'] = $hargaClean;

        if ($request->boolean('use_auto_time')) {
             $validated['waktu_pengerjaan'] = now();
        } else {
             $validated['waktu_pengerjaan'] = now()->parse($request->waktu_pengerjaan);
        }

       
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
                    'waktu_pengerjaan' => $aset->waktu_pengerjaan,
                ]);
            }
            
            // Sync changes to Active Stock Opname Periods
            if (isset($changes['kondisi_aset'])) {
                $newKondisi = $changes['kondisi_aset']['new'];
                
                // Find all active periods
                $activePeriodIds = \App\Models\StockOpnamePeriod::where('status', 'Aktif')->pluck('id');
                
                if ($activePeriodIds->isNotEmpty()) {
                    // Update existing records for this asset in active periods
                    \App\Models\StockOpnameRecord::whereIn('stock_opname_period_id', $activePeriodIds)
                        ->where('aset_id', $aset->id)
                        ->update(['kondisi' => $newKondisi]);
                }
            }

        } else {
             $aset->save();
        }


        return redirect()->route('update-aset.index')->with('success', 'Data aset berhasil diperbarui.');
    }
    public function export(Request $request)
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

        $filename = "data_aset_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = [
            'Kode Aset', 
            'Nama Aset', 
            'Serial Number', 
            'Tipe Aset', 
            'Kategori', 
            'Jenis Aset', 
            'Lokasi', 
            'User', 
            'Tanggal Beli', 
            'Umur (Tahun)', 
            'Harga', 
            'Kondisi', 
            'Keterangan'
        ];

        $callback = function() use($asets, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($asets as $aset) {
                $row = [
                    $aset->kode_aset,
                    $aset->nama_aset,
                    $aset->serial_number,
                    $aset->tipe_aset,
                    $aset->kategori_aset,
                    $aset->jenis_aset,
                    $aset->lokasi,
                    $aset->nama_user,
                    $aset->tanggal_beli,
                    $aset->umur_aset,
                    $aset->harga_aset,
                    $aset->kondisi_aset,
                    $aset->keterangan
                ];
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
