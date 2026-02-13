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
        $isFrozen = $period->status === 'Selesai';

        if ($isFrozen) {
            // === FREEZE MODE: Data dari snapshot records ===
            $records = StockOpnameRecord::where('stock_opname_period_id', $id)->get();
            $totalAssets = $records->count();

            // Group by snapshot_lokasi
            $locations = $records->groupBy('snapshot_lokasi')->map(function ($group, $lokasiName) {
                $totalInLoc = $group->count();
                $checkedInLoc = $group->where('is_snapshot_only', false)->count();

                return [
                    'name' => $lokasiName,
                    'total' => $totalInLoc,
                    'checked' => $checkedInLoc,
                    'percentage' => $totalInLoc > 0 ? round(($checkedInLoc / $totalInLoc) * 100) : 0,
                ];
            })->values();

            $totalChecked = $records->where('is_snapshot_only', false)->count();
        } else {
            // === LIVE MODE: Data dari master aset ===
            $totalAssets = Aset::count();

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
                        'percentage' => $totalInLoc > 0 ? round(($checkedInLoc / $totalInLoc) * 100) : 0,
                    ];
                });

            $totalChecked = $locations->sum('checked');
        }

        return Inertia::render('StockOpname/Dashboard', [
            'period' => $period,
            'locations' => $locations,
            'totalAssets' => $totalAssets,
            'totalChecked' => $totalChecked,
        ]);
    }

    public function action(Request $request, $id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $location = $request->query('lokasi');
        $isFrozen = $period->status === 'Selesai';

        if (!$location) {
            return redirect()->route('stock-opname.show', $id);
        }

        if ($isFrozen) {
            // === FREEZE MODE: Data sepenuhnya dari snapshot records ===
            $records = StockOpnameRecord::where('stock_opname_period_id', $id)
                ->where('snapshot_lokasi', $location)
                ->with('aset')
                ->get();

            $assets = $records->map(function ($record) {
                return [
                    'id' => $record->aset_id,
                    'nama_aset' => $record->snapshot_nama_aset,
                    'kode_aset' => $record->snapshot_kode_aset,
                    'serial_number' => $record->snapshot_serial_number,
                    'tanggal_beli' => $record->snapshot_tanggal_beli,
                    'kondisi_aset' => $record->snapshot_kondisi_aset,
                    'nama_user' => $record->snapshot_nama_user,
                    'opname_status' => $record->is_snapshot_only ? null : $record->status,
                    'opname_kondisi' => $record->is_snapshot_only ? ($record->snapshot_kondisi_aset ?? 'Bagus') : ($record->kondisi ?? 'Bagus'),
                    'catatan' => $record->is_snapshot_only ? '' : ($record->catatan ?? ''),
                    'lokasi' => $record->is_snapshot_only ? $record->snapshot_lokasi : ($record->lokasi ?? $record->snapshot_lokasi),
                    'opname_lokasi' => $record->is_snapshot_only ? $record->snapshot_lokasi : ($record->lokasi ?? $record->snapshot_lokasi),
                    'opname_nama_user' => $record->is_snapshot_only ? $record->snapshot_nama_user : ($record->nama_user ?? $record->snapshot_nama_user),
                    'tipe_aset' => $record->aset->tipe_aset ?? '-',
                    'kategori_aset' => $record->aset->kategori_aset ?? '-',
                    'jenis_aset' => $record->aset->jenis_aset ?? '-',
                ];
            });

            // Dalam freeze mode, lokasi juga dari snapshot (bukan master)
            $allLocations = StockOpnameRecord::where('stock_opname_period_id', $id)
                ->whereNotNull('snapshot_lokasi')
                ->select('snapshot_lokasi')
                ->distinct()
                ->orderBy('snapshot_lokasi')
                ->pluck('snapshot_lokasi');
        } else {
            // LIVE MODE: Data dari master aset
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
                        'tanggal_beli' => $aset->tanggal_beli,
                        'kondisi_aset' => $aset->kondisi_aset,
                        'nama_user' => $aset->nama_user,
                        'opname_status' => $record ? $record->status : null,
                        'opname_kondisi' => $record ? $record->kondisi : ($aset->kondisi_aset ?? 'Bagus'),
                        'catatan' => $record ? $record->catatan : '',
                        'lokasi' => $aset->lokasi,
                        'opname_lokasi' => $record ? $record->lokasi : $aset->lokasi,
                        'opname_nama_user' => $record ? $record->nama_user : $aset->nama_user,
                        'tipe_aset' => $aset->tipe_aset,
                        'kategori_aset' => $aset->kategori_aset,
                        'jenis_aset' => $aset->jenis_aset,
                    ];
                });

            $allLocations = Aset::select('lokasi')->distinct()->orderBy('lokasi')->pluck('lokasi');
        }

        return Inertia::render('StockOpname/Form', [
            'period' => $period,
            'location' => $location,
            'assets' => $assets,
            'allLocations' => $allLocations,
        ]);
    }

    public function export(Request $request, $id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $location = $request->query('lokasi');
        $isFrozen = $period->status === 'Selesai';
        $filename = "StockOpname-{$period->judul}" . ($location ? "-{$location}" : "") . "-" . date('d-m-Y') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        if ($isFrozen) {
            // === FREEZE MODE ===
            $query = StockOpnameRecord::where('stock_opname_period_id', $id)->with('aset');
            if ($location) {
                $query->where('snapshot_lokasi', $location);
            }
            $records = $query->get();
            
             $assets = $records->map(function ($record) {
                return [
                    'kode_aset' => $record->snapshot_kode_aset,
                    'nama_aset' => $record->snapshot_nama_aset,
                    'serial_number' => $record->snapshot_serial_number,
                    'tanggal_beli' => $record->snapshot_tanggal_beli ? date('d/m/Y', strtotime($record->snapshot_tanggal_beli)) : '-',
                    'nama_user' => $record->is_snapshot_only ? $record->snapshot_nama_user : ($record->nama_user ?? $record->snapshot_nama_user),
                    'lokasi' => $record->is_snapshot_only ? $record->snapshot_lokasi : ($record->lokasi ?? $record->snapshot_lokasi),
                    'status' => $record->is_snapshot_only ? 'Belum Dicek' : ($record->status == 'ada' ? 'Ada' : 'Hilang/Tidak Ditemukan'),
                    'kondisi' => $record->is_snapshot_only ? ($record->snapshot_kondisi_aset ?? 'Bagus') : ($record->kondisi ?? 'Bagus'),
                    'catatan' => $record->is_snapshot_only ? '' : ($record->catatan ?? ''),
                ];
            });

        } else {
             // === LIVE MODE ===
             if ($location) {
                 $assetsQuery = Aset::where('lokasi', $location);
             } else {
                 $assetsQuery = Aset::query();
             }
             
             $assets = $assetsQuery->with(['stockOpnameRecords' => function($q) use ($id) {
                    $q->where('stock_opname_period_id', $id);
                }])
                ->get()
                ->map(function ($aset) {
                    $record = $aset->stockOpnameRecords->first();
                    return [
                        'kode_aset' => $aset->kode_aset,
                        'nama_aset' => $aset->nama_aset,
                        'serial_number' => $aset->serial_number,
                        'tanggal_beli' => $aset->tanggal_beli ? date('d/m/Y', strtotime($aset->tanggal_beli)) : '-',
                        'nama_user' => $record ? $record->nama_user : $aset->nama_user,
                        'lokasi' => $record ? $record->lokasi : $aset->lokasi,
                        'status' => $record ? ($record->status == 'ada' ? 'Ada' : 'Hilang') : 'Belum Dicek',
                        'kondisi' => $record ? $record->kondisi : ($aset->kondisi_aset),
                        'catatan' => $record ? $record->catatan : '',
                    ];
                });
        }

        $callback = function() use($assets) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Kode Aset', 'Nama Aset', 'Serial Number', 'Tanggal Beli', 'User', 'Lokasi', 'Status Check', 'Kondisi Fisik', 'Catatan']);

            foreach ($assets as $row) {
                fputcsv($file, [
                    $row['kode_aset'],
                    $row['nama_aset'],
                    $row['serial_number'],
                    $row['tanggal_beli'],
                    $row['nama_user'],
                    $row['lokasi'],
                    $row['status'],
                    $row['kondisi'],
                    $row['catatan'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportAll($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $isFrozen = $period->status === 'Selesai';
        $filename = "StockOpname-{$period->judul}-Semua-Lokasi-" . date('d-m-Y') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        if ($isFrozen) {
            // === FREEZE MODE: Export all from snapshot ===
            $records = StockOpnameRecord::where('stock_opname_period_id', $id)
                ->with('aset')
                ->orderBy('snapshot_lokasi')
                ->orderBy('snapshot_kode_aset')
                ->get();
            
            $assets = $records->map(function ($record) {
                return [
                    'kode_aset' => $record->snapshot_kode_aset,
                    'nama_aset' => $record->snapshot_nama_aset,
                    'serial_number' => $record->snapshot_serial_number,
                    'kategori' => $record->aset->kategori_aset ?? '-',
                    'tanggal_beli' => $record->snapshot_tanggal_beli ? date('d/m/Y', strtotime($record->snapshot_tanggal_beli)) : '-',
                    'nama_user' => $record->is_snapshot_only ? $record->snapshot_nama_user : ($record->nama_user ?? $record->snapshot_nama_user),
                    'lokasi' => $record->is_snapshot_only ? $record->snapshot_lokasi : ($record->lokasi ?? $record->snapshot_lokasi),
                    'status' => $record->is_snapshot_only ? 'Belum Dicek' : ($record->status == 'ada' ? 'Ada' : 'Hilang'),
                    'kondisi' => $record->is_snapshot_only ? ($record->snapshot_kondisi_aset ?? 'Bagus') : ($record->kondisi ?? 'Bagus'),
                    'catatan' => $record->is_snapshot_only ? '' : ($record->catatan ?? ''),
                ];
            });

        } else {
            // === LIVE MODE: Export all from master ===
            $assets = Aset::with(['stockOpnameRecords' => function($q) use ($id) {
                    $q->where('stock_opname_period_id', $id);
                }])
                ->orderBy('lokasi')
                ->orderBy('kode_aset')
                ->get()
                ->map(function ($aset) {
                    $record = $aset->stockOpnameRecords->first();
                    return [
                        'kode_aset' => $aset->kode_aset,
                        'nama_aset' => $aset->nama_aset,
                        'serial_number' => $aset->serial_number,
                        'kategori' => $aset->kategori_aset,
                        'tanggal_beli' => $aset->tanggal_beli ? date('d/m/Y', strtotime($aset->tanggal_beli)) : '-',
                        'nama_user' => $record ? $record->nama_user : $aset->nama_user,
                        'lokasi' => $record ? $record->lokasi : $aset->lokasi,
                        'status' => $record ? ($record->status == 'ada' ? 'Ada' : 'Hilang') : 'Belum Dicek',
                        'kondisi' => $record ? $record->kondisi : ($aset->kondisi_aset),
                        'catatan' => $record ? $record->catatan : '',
                    ];
                });
        }

        $callback = function() use($assets) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Kode Aset', 'Nama Aset', 'Serial Number', 'Kategori', 'Tanggal Beli', 'User', 'Lokasi', 'Keberadaan', 'Kondisi Fisik', 'Catatan']);

            foreach ($assets as $row) {
                fputcsv($file, [
                    $row['kode_aset'],
                    $row['nama_aset'],
                    $row['serial_number'],
                    $row['kategori'],
                    $row['tanggal_beli'],
                    $row['nama_user'],
                    $row['lokasi'],
                    $row['status'],
                    $row['kondisi'],
                    $row['catatan'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function getAllAssets($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);
        $isFrozen = $period->status === 'Selesai';

        if ($isFrozen) {
            // === FREEZE MODE ===
            $records = StockOpnameRecord::where('stock_opname_period_id', $id)
                ->with('aset')
                ->orderBy('snapshot_lokasi')
                ->orderBy('snapshot_kode_aset')
                ->get();
            
            $assets = $records->map(function ($record) {
                return [
                    'kode_aset' => $record->snapshot_kode_aset,
                    'nama_aset' => $record->snapshot_nama_aset,
                    'serial_number' => $record->snapshot_serial_number,
                    'kategori_aset' => $record->aset->kategori_aset ?? '-',
                    'tanggal_beli' => $record->snapshot_tanggal_beli,
                    'nama_user' => $record->is_snapshot_only ? $record->snapshot_nama_user : ($record->nama_user ?? $record->snapshot_nama_user),
                    'lokasi' => $record->is_snapshot_only ? $record->snapshot_lokasi : ($record->lokasi ?? $record->snapshot_lokasi),
                    'opname_status' => $record->is_snapshot_only ? null : $record->status,
                    'kondisi' => $record->is_snapshot_only ? ($record->snapshot_kondisi_aset ?? 'Bagus') : ($record->kondisi ?? 'Bagus'),
                    'catatan' => $record->is_snapshot_only ? '' : ($record->catatan ?? ''),
                ];
            });
        } else {
            // === LIVE MODE ===
            $assets = Aset::with(['stockOpnameRecords' => function($q) use ($id) {
                    $q->where('stock_opname_period_id', $id);
                }])
                ->orderBy('lokasi')
                ->orderBy('kode_aset')
                ->get()
                ->map(function ($aset) {
                    $record = $aset->stockOpnameRecords->first();
                    return [
                        'kode_aset' => $aset->kode_aset,
                        'nama_aset' => $aset->nama_aset,
                        'serial_number' => $aset->serial_number,
                        'kategori_aset' => $aset->kategori_aset,
                        'tanggal_beli' => $aset->tanggal_beli,
                        'nama_user' => $record ? $record->nama_user : $aset->nama_user,
                        'lokasi' => $record ? $record->lokasi : $aset->lokasi,
                        'opname_status' => $record ? $record->status : null,
                        'kondisi' => $record ? $record->kondisi : ($aset->kondisi_aset),
                        'catatan' => $record ? $record->catatan : '',
                    ];
                });
        }

        return response()->json([
            'assets' => $assets
        ]);
    }

    public function updateRecord(Request $request)
    {
        $request->validate([
            'period_id' => 'required|exists:stock_opname_periods,id',
            'aset_id' => 'required|exists:asets,id',
            'status' => 'nullable|string',
            'kondisi' => 'nullable|string',
            'catatan' => 'nullable|string',
            'lokasi' => 'nullable|string',
            'nama_user' => 'nullable|string',
        ]);

        // Block updates if period is frozen
        $period = StockOpnamePeriod::findOrFail($request->period_id);
        if ($period->status === 'Selesai') {
            return response()->json(['message' => 'Periode sudah diselesaikan. Data tidak bisa diubah.'], 403);
        }

        DB::transaction(function () use ($request) {
            if (is_null($request->status)) {
                StockOpnameRecord::where('stock_opname_period_id', $request->period_id)
                    ->where('aset_id', $request->aset_id)
                    ->delete();
                return;
            }

            // Update/Create Record
            StockOpnameRecord::updateOrCreate(
                [
                    'stock_opname_period_id' => $request->period_id,
                    'aset_id' => $request->aset_id,
                ],
                [
                    'user_id' => auth()->id(),
                    'status' => $request->status,
                    'kondisi' => $request->kondisi ?? 'Bagus',
                    'catatan' => $request->catatan,
                    'lokasi' => $request->lokasi,
                    'nama_user' => $request->nama_user,
                    'tanggal_cek' => now(),
                    'is_snapshot_only' => false,
                ]
            );

            $aset = Aset::findOrFail($request->aset_id);

            $newKondisi = ($request->status === 'hilang' || $request->status === 'tidak_ditemukan')
                ? 'Hilang'
                : $request->kondisi;

            if ($aset->kondisi_aset !== $newKondisi) {
                $oldKondisi = $aset->kondisi_aset;
                $aset->kondisi_aset = $newKondisi;
                $aset->waktu_pengerjaan = now();
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

            // check location change
            if ($request->lokasi && $aset->lokasi !== $request->lokasi) {
                $oldLokasi = $aset->lokasi;
                $newLokasi = $request->lokasi;
                $aset->lokasi = $newLokasi;
                $aset->waktu_pengerjaan = now();
                $aset->save();

                \App\Models\RiwayatAset::create([
                    'aset_id' => $aset->id,
                    'user_id' => auth()->id(),
                    'action' => 'STOCK OPNAME',
                    'changes' => [
                        'lokasi' => [
                            'old' => $oldLokasi,
                            'new' => $newLokasi,
                        ]
                    ],
                    'description' => "Perpindahan lokasi saat Stock Opname: $oldLokasi -> $newLokasi",
                    'waktu_pengerjaan' => now(),
                ]);
            }

            // check user/holder change
            if ($request->has('nama_user') && $aset->nama_user !== $request->nama_user) {
                $oldUser = $aset->nama_user;
                $newUser = $request->nama_user;
                $aset->nama_user = $newUser;
                $aset->waktu_pengerjaan = now();
                $aset->save();

                \App\Models\RiwayatAset::create([
                    'aset_id' => $aset->id,
                    'user_id' => auth()->id(),
                    'action' => 'STOCK OPNAME',
                    'changes' => [
                        'nama_user' => [
                            'old' => $oldUser,
                            'new' => $newUser,
                        ]
                    ],
                    'description' => "Perpindahan pemegang aset saat Stock Opname: $oldUser -> $newUser",
                    'waktu_pengerjaan' => now(),
                ]);
            }
        });

        return response()->json(['message' => 'Saved']);
    }

   
    public function complete($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);

        DB::transaction(function () use ($period) {
            // Ambil semua aset
            $allAsets = Aset::all();

            foreach ($allAsets as $aset) {
                // Cek apakah sudah ada record opname untuk aset ini
                $existingRecord = StockOpnameRecord::where('stock_opname_period_id', $period->id)
                    ->where('aset_id', $aset->id)
                    ->first();

                if ($existingRecord) {
                    // Update record yang sudah ada dengan snapshot data
                    $existingRecord->update([
                        'snapshot_nama_aset' => $aset->nama_aset,
                        'snapshot_kode_aset' => $aset->kode_aset,
                        'snapshot_serial_number' => $aset->serial_number,
                        'snapshot_tanggal_beli' => $aset->tanggal_beli,
                        'snapshot_harga_aset' => $aset->harga_aset,
                        'snapshot_kondisi_aset' => $aset->kondisi_aset,
                        'snapshot_lokasi' => $existingRecord->lokasi ?? $aset->lokasi,
                        'snapshot_nama_user' => $existingRecord->nama_user ?? $aset->nama_user,
                    ]);
                } else {
                    // Buat record snapshot-only untuk aset yang belum dicek
                    StockOpnameRecord::create([
                        'stock_opname_period_id' => $period->id,
                        'aset_id' => $aset->id,
                        'user_id' => null,
                        'status' => 'belum_dicek',
                        'kondisi' => $aset->kondisi_aset ?? 'Bagus',
                        'catatan' => null,
                        'lokasi' => $aset->lokasi,
                        'nama_user' => $aset->nama_user,
                        'tanggal_cek' => now(),
                        'snapshot_nama_aset' => $aset->nama_aset,
                        'snapshot_kode_aset' => $aset->kode_aset,
                        'snapshot_serial_number' => $aset->serial_number,
                        'snapshot_tanggal_beli' => $aset->tanggal_beli,
                        'snapshot_harga_aset' => $aset->harga_aset,
                        'snapshot_kondisi_aset' => $aset->kondisi_aset,
                        'snapshot_lokasi' => $aset->lokasi,
                        'snapshot_nama_user' => $aset->nama_user,
                        'is_snapshot_only' => true,
                    ]);
                }
            }

            // Update status periode
            $period->update([
                'status' => 'Selesai',
                'tanggal_selesai' => now(),
            ]);
        });

        return redirect()->back();
    }

    /**
     * LIVE MODE: Aktifkan kembali periode.
     * Hapus snapshot-only records dan sinkronkan data kembali ke master.
     */
    public function reopen($id)
    {
        $period = StockOpnamePeriod::findOrFail($id);

        DB::transaction(function () use ($period) {
            // Hapus records yang hanya snapshot (aset yang belum dicek user)
            StockOpnameRecord::where('stock_opname_period_id', $period->id)
                ->where('is_snapshot_only', true)
                ->delete();

            // Sinkronkan records yang sudah dicek user ke master data terbaru
            $records = StockOpnameRecord::where('stock_opname_period_id', $period->id)->get();
            foreach ($records as $record) {
                $aset = Aset::find($record->aset_id);
                if ($aset) {
                    $record->update([
                        'lokasi' => $aset->lokasi,
                        'kondisi' => $aset->kondisi_aset ?? 'Bagus',
                        'nama_user' => $aset->nama_user,
                        'snapshot_nama_aset' => null,
                        'snapshot_kode_aset' => null,
                        'snapshot_serial_number' => null,
                        'snapshot_tanggal_beli' => null,
                        'snapshot_harga_aset' => null,
                        'snapshot_kondisi_aset' => null,
                        'snapshot_lokasi' => null,
                        'snapshot_nama_user' => null,
                    ]);
                }
            }

            // Update status periode
            $period->update([
                'status' => 'Aktif',
                'tanggal_selesai' => null,
            ]);
        });

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
