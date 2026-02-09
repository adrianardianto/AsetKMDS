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
            'serial_number' => 'nullable|string|max:255|unique:asets,serial_number',
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

    public function generateKode(Request $request)
    {
        $tipeAset = $request->query('tipe_aset');
        
        if (!$tipeAset) {
            return response()->json(['kode' => '']);
        }

        $date = now();
        $year = $date->year;
        $month = $this->toRoman($date->month);
        $typeCode = $this->getTypeCode($tipeAset);

        $prefix = "{$year}/{$month}/{$typeCode}/";
        
        // Find the last asset code with this prefix
        $lastAset = Aset::where('kode_aset', 'like', "{$prefix}%")
            ->orderBy('id', 'desc')
            ->first();

        if ($lastAset) {
            // Extract the sequence number from the last code
            $lastSequence = (int) substr($lastAset->kode_aset, strrpos($lastAset->kode_aset, '/') + 1);
            $newSequence = str_pad($lastSequence + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newSequence = '0001';
        }

        return response()->json([
            'kode' => "{$prefix}{$newSequence}"
        ]);
    }

    private function toRoman($num) 
    {
        $map = [
            'M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 
            'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40, 
            'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1
        ];
        $returnValue = '';
        while ($num > 0) {
            foreach ($map as $roman => $int) {
                if ($num >= $int) {
                    $num -= $int;
                    $returnValue .= $roman;
                    break;
                }
            }
        }
        return $returnValue;
    }

    private function getTypeCode($type)
    {
        $mapping = [
            'Bangunan 1' => 'GDG',
            'Bangunan 2' => 'GDG',
            'Kendaraan' => 'KEND',
            'Mesin & Peralatan' => 'MSN',
            'Peralatan Kantor 1' => 'IK',
            'Peralatan Kantor 2' => 'IK',
            'Peralatan Show Room 1' => 'IS',
            'Peralatan Show Room 2' => 'IS',
            'Tanah' => 'TNH',
        ];
        return $mapping[$type] ?? 'OTH';
    }
}
