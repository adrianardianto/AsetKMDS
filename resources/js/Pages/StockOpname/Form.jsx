import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import axios from 'axios';

export default function Form({ period, location, assets }) {
    const [localAssets, setLocalAssets] = useState(assets);
    const [savingId, setSavingId] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, done

    const updateRecord = async (id, field, value) => {
        const assetIndex = localAssets.findIndex(a => a.id === id);
        if (assetIndex === -1) return;

        const asset = localAssets[assetIndex];
        const newAsset = { ...asset, [field]: value };
        
        // Update local state immediately for UI responsiveness
        const newAssetsList = [...localAssets];
        newAssetsList[assetIndex] = newAsset;
        setLocalAssets(newAssetsList);
        setSavingId(id);

        try {
            const url = typeof route === 'function' ? route('stock-opname.update-record') : '/stock-opname/record';
            await axios.post(url, {
                period_id: period.id,
                aset_id: id,
                status: newAsset.opname_status, // Allow null to delete record
                kondisi: newAsset.opname_kondisi || 'Bagus',
                catatan: newAsset.catatan || ''
            });
        } catch (error) {
            console.error('Failed to save record', error);
            // alert('Gagal menyimpan perubahan.'); 
        } finally {
            setSavingId(null);
        }
    };

    const updateLocal = (id, field, value) => {
        const assetIndex = localAssets.findIndex(a => a.id === id);
        if (assetIndex === -1) return;
        const newAssets = [...localAssets];
        newAssets[assetIndex] = { ...newAssets[assetIndex], [field]: value };
        setLocalAssets(newAssets);
    };

    const filteredAssets = localAssets.filter(asset => {
        if (filter === 'all') return true;
        // Simple logic: if status is 'ada' (default) and condition is same as master, maybe consider it "pending"?
        // Or actually, track if it was interacted with? 
        // For now let's just show all.
        return true;
    });

    return (
        <MainLayout>
            <Head title={`Cek Lokasi: ${location}`} />

            <div className="max-w-6xl mx-auto">
                 {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Link href={`/stock-opname/${period.id}`} className="hover:text-indigo-600">
                                &larr; Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Lokasi: <span className="text-indigo-600">{location}</span>
                        </h1>
                        <p className="text-sm text-gray-500">{period.judul}</p>
                    </div>
                    
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                        Total Aset: {localAssets.length}
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-4 py-3 w-[150px]">Kode Aset</th>
                                    <th className="px-4 py-3 min-w-[200px]">Nama Aset</th>
                                    <th className="px-4 py-3 w-[150px] whitespace-nowrap">Serial Number</th>
                                    <th className="px-4 py-3 w-[150px]">Keberadaan</th>
                                    <th className="px-4 py-3 w-[200px]">Kondisi Fisik</th>
                                    <th className="px-4 py-3 w-[200px]">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 align-top font-mono text-xs text-gray-600">
                                            {asset.kode_aset}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="font-medium text-gray-900">{asset.nama_aset}</div>
                                            {savingId === asset.id && (
                                                <span className="text-xs text-indigo-500 animate-pulse block mt-1">Saving...</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top text-xs text-gray-600 font-mono">
                                            {asset.serial_number || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateRecord(asset.id, 'opname_status', asset.opname_status === 'ada' ? null : 'ada')}
                                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition ${
                                                        asset.opname_status === 'ada'
                                                            ? 'bg-green-100 text-green-700 border-green-200'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    Ada
                                                </button>
                                                <button
                                                    onClick={() => updateRecord(asset.id, 'opname_status', asset.opname_status === 'hilang' ? null : 'hilang')}
                                                    className={`px-3 py-1.5 rounded text-xs font-medium border transition ${
                                                        asset.opname_status === 'hilang'
                                                            ? 'bg-red-100 text-red-700 border-red-200'
                                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    Hilang
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            {asset.opname_status === 'ada' ? (
                                                ['Bagus', 'Rusak'].includes(asset.opname_kondisi) ? (
                                                    <select
                                                        value={asset.opname_kondisi}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Lainnya') {
                                                                updateLocal(asset.id, 'opname_kondisi', '');
                                                            } else {
                                                                updateRecord(asset.id, 'opname_kondisi', e.target.value);
                                                            }
                                                        }}
                                                        className={`w-full text-sm rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 py-1.5 ${
                                                            asset.opname_kondisi === 'Rusak' ? 'bg-red-50 text-red-700 border-red-200' : ''
                                                        }`}
                                                    >
                                                        <option value="Bagus">Bagus</option>
                                                        <option value="Rusak">Rusak</option>
                                                        <option value="Lainnya">Lainnya...</option>
                                                    </select>
                                                ) : (
                                                    <div className="flex gap-1 items-center">
                                                        <input 
                                                            type="text"
                                                            value={asset.opname_kondisi}
                                                            onChange={(e) => updateLocal(asset.id, 'opname_kondisi', e.target.value)}
                                                            onBlur={(e) => updateRecord(asset.id, 'opname_kondisi', e.target.value)}
                                                            placeholder="Ketik kondisi..."
                                                            className="w-full text-sm rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1.5"
                                                            autoFocus
                                                        />
                                                        <button 
                                                            onClick={() => updateRecord(asset.id, 'opname_kondisi', 'Bagus')}
                                                            className="text-gray-400 hover:text-red-500 p-1"
                                                            title="Kembali ke pilihan"
                                                        >
                                                            &#10005;
                                                        </button>
                                                    </div>
                                                )
                                            ) : asset.opname_status === 'hilang' ? (
                                                <span className="text-xs text-red-500 italic">
                                                    - Aset Hilang -
                                                </span>
                                            ) : (
                                                 <span className="text-xs text-gray-400 italic">
                                                    - Belum Dicek -
                                                </span>
                                            )}
                                            
                                            {/* Visual indicator of what's in DB vs what's selected */}
                                            {asset.opname_kondisi !== asset.kondisi_aset && asset.opname_status === 'ada' && (
                                                <div className="text-[10px] text-orange-500 mt-1">
                                                    Master: {asset.kondisi_aset} &rarr; Update
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <input 
                                                type="text" 
                                                value={asset.catatan}
                                                onChange={(e) => updateLocal(asset.id, 'catatan', e.target.value)}
                                                onBlur={(e) => updateRecord(asset.id, 'catatan', e.target.value)}
                                                placeholder="..."
                                                className="w-full text-xs border-gray-200 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredAssets.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            Tidak ada aset di lokasi ini.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
