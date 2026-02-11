<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\StockOpnamePeriod;
use App\Models\StockOpnameRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StockOpnameController extends Controller
{
    public function index()
    {
        $periods = StockOpnamePeriod::orderBy('created_at', 'desc')->get();
        return Inertia::render('StockOpname/Index', [
            'periods' => $periods
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
        ]);

        StockOpnamePeriod::create([
            'judul' => $request->judul,
            'keterangan' => $request->keterangan,
            'tanggal_mulai' => $request->tanggal_mulai,
            'status' => 'Aktif',
        ]);

        return redirect()->back();
    }

    public function show($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);

        // Get total assets count
        $totalAssets = Aset::count();
        
        // Get progress per location
        // logic: Get all distinct locations from Aset
        // For each location, count how many have records in this period
        
        $locations = Aset::select('lokasi')
            ->distinct()
            ->orderBy('lokasi')
            ->get()
            ->map(function ($loc) use ($id) {
                $totalInLoc = Aset::where('lokasi', $loc->lokasi)->count();
                $checkedInLoc = StockOpnameRecord::where('stock_opname_period_id', $id)
                    ->whereHas('aset', function($q) use ($loc) {
                        $q->where('lokasi', $loc->lokasi);
                    })
                    ->count();
                
                return [
                    'name' => $loc->lokasi,
                    'total' => $totalInLoc,
                    'checked' => $checkedInLoc,
                    'percentage' => $totalInLoc > 0 ? round(($checkedInLoc / $totalInLoc) * 100) : 0
                ];
            });

        return Inertia::render('StockOpname/Dashboard', [
            'period' => $period,
            'locations' => $locations,
            'totalAssets' => $totalAssets,
            'totalChecked' => $locations->sum('checked')
        ]);
    }

    public function action(Request $request, $id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $location = $request->query('lokasi');

        if (!$location) {
            return redirect()->route('stock-opname.show', $id);
        }

        // Fetch assets in location
        // Also fetch their existing record for this period if any
        $assets = Aset::where('lokasi', $location)
            ->with(['stockOpnameRecords' => function($q) use ($id) {
                $q->where('stock_opname_period_id', $id);
            }])
            ->get()
            ->map(function ($aset) {
                $record = $aset->stockOpnameRecords->first();
                return [
                    'id' => $aset->id,
                    'nama_aset' => $aset->nama_aset,
                    'kode_aset' => $aset->kode_aset,
                    'serial_number' => $aset->serial_number,
                    'kondisi_aset' => $aset->kondisi_aset, // Current master condition
                    'opname_status' => $record ? $record->status : null, 
                    'opname_kondisi' => $record ? $record->kondisi : ($aset->kondisi_aset ?? 'Bagus'),
                    'catatan' => $record ? $record->catatan : '',
                ];
            });

        return Inertia::render('StockOpname/Form', [
            'period' => $period,
            'location' => $location,
            'assets' => $assets
        ]);
    }

    public function updateRecord(Request $request)
    {
        $request->validate([
            'period_id' => 'required|exists:stock_opname_periods,id',
            'aset_id' => 'required|exists:asets,id',
            'status' => 'nullable|string', // ada, hilang, tidak_ditemukan (nullable for reset)
            'kondisi' => 'nullable|string', // Baik, Rusak, Lainnya
            'catatan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // Check if status is null -> Delete record to reset
            if (is_null($request->status)) {
                StockOpnameRecord::where('stock_opname_period_id', $request->period_id)
                    ->where('aset_id', $request->aset_id)
                    ->delete();
                // We don't revert master asset condition because we don't know what it looked like before
                return;
            }

            // 1. Update/Create Record
            StockOpnameRecord::updateOrCreate(
                [
                    'stock_opname_period_id' => $request->period_id,
                    'aset_id' => $request->aset_id,
                ],
                [
                    'user_id' => auth()->id(), // Assuming auth is available, else null
                    'status' => $request->status,
                    'kondisi' => $request->kondisi ?? 'Bagus', // Default to Bagus if not provided
                    'catatan' => $request->catatan,
                    'tanggal_cek' => now(),
                ]
            );

            // 2. Sync to Master Aset
            // Logic:
            // If Opname Status is 'hilang' -> Master Condition = 'Hilang'
            // If Opname Status is 'ada' -> Master Condition = Request Kondisi (e.g. Rusak)
            
            $aset = Aset::findOrFail($request->aset_id);
            
            $newKondisi = ($request->status === 'hilang' || $request->status === 'tidak_ditemukan') 
                ? 'Hilang' 
                : $request->kondisi;

            if ($aset->kondisi_aset !== $newKondisi) {
                $oldKondisi = $aset->kondisi_aset;
                $aset->kondisi_aset = $newKondisi;
                $aset->save();

                // Create History
                \App\Models\RiwayatAset::create([
                    'aset_id' => $aset->id,
                    'user_id' => auth()->id(),
                    'action' => 'STOCK OPNAME',
                    'changes' => [
                        'kondisi_aset' => [
                            'old' => $oldKondisi,
                            'new' => $newKondisi,
                        ]
                    ],
                    'description' => "Update kondisi fisik dari Stock Opname: $oldKondisi -> $newKondisi",
                    'waktu_pengerjaan' => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Saved']);
    }
    public function complete($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $period->update([
            'status' => 'Selesai',
            'tanggal_selesai' => now(),
        ]);
        
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
        ]);

        $period = StockOpnamePeriod::findOrFail($id);
        $period->update([
            'judul' => $request->judul,
            'keterangan' => $request->keterangan,
            'tanggal_mulai' => $request->tanggal_mulai,
        ]);

        return redirect()->back()->with('success', 'Periode berhasil diperbarui');
    }

    public function destroy($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $period->delete();

        return redirect()->back()->with('success', 'Periode berhasil dihapus');
    }
}
