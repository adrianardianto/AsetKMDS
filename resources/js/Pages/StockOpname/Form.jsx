import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import axios from 'axios';

export default function Form({ period, location, assets, allLocations }) {
    const isFrozen = period.status === 'Selesai';

    const [localAssets, setLocalAssets] = useState(assets.map(a => ({
        ...a,
        lokasi: a.opname_lokasi || a.lokasi,
        opname_nama_user: a.opname_nama_user || a.nama_user || ''
    })));
    const [savingId, setSavingId] = useState(null);
    const [filter, setFilter] = useState('all');

    const updateRecord = async (id, field, value) => {
        if (isFrozen) return;

        const assetIndex = localAssets.findIndex(a => a.id === id);
        if (assetIndex === -1) return;

        const asset = localAssets[assetIndex];
        
        let newStatus = asset.opname_status;
        if ((field === 'lokasi' || field === 'opname_kondisi' || field === 'catatan' || field === 'opname_nama_user') && !newStatus) {
            newStatus = 'ada';
        }
        
        if (field === 'opname_status') {
             newStatus = value;
        }

        const newAsset = { ...asset, [field]: value, opname_status: newStatus };
        
        const newAssetsList = [...localAssets];
        newAssetsList[assetIndex] = newAsset;
        setLocalAssets(newAssetsList);
        setSavingId(id);

        try {
            const url = typeof route === 'function' ? route('stock-opname.update-record') : '/stock-opname/record';
            await axios.post(url, {
                period_id: period.id,
                aset_id: id,
                status: newStatus,
                kondisi: newAsset.opname_kondisi || 'Bagus',
                catatan: newAsset.catatan || '',
                lokasi: newAsset.lokasi,
                nama_user: newAsset.opname_nama_user || ''
            });
        } catch (error) {
            console.error('Failed to save record', error);
        } finally {
            setSavingId(null);
        }
    };

    const updateLocal = (id, field, value) => {
        if (isFrozen) return;

        const assetIndex = localAssets.findIndex(a => a.id === id);
        if (assetIndex === -1) return;
        const newAssets = [...localAssets];
        newAssets[assetIndex] = { ...newAssets[assetIndex], [field]: value };
        setLocalAssets(newAssets);
    };

    const filteredAssets = localAssets.filter(asset => {
        if (filter === 'all') return true;
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
                            <Link href={`/stock-opname/${period.id}`} className="hover:text-[#b8860b]">
                                &larr; Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Lokasi: <span className="text-[#b8860b]">{location}</span>
                        </h1>
                        <p className="text-sm text-gray-500">{period.judul}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isFrozen && (
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Read-Only (Snapshot Historis)</span>
                            </div>
                        )}
                        <div className="bg-[#b8860b]/10 text-[#b8860b] px-4 py-2 rounded-lg text-sm font-medium">
                            Total Aset: {localAssets.length}
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isFrozen ? 'border-blue-200' : 'border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b text-xs uppercase font-medium ${isFrozen ? 'bg-blue-50/50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                    <th className="px-2 py-2.5 w-[45px] text-center">No</th>
                                    <th className="px-2 py-2.5 w-[130px]">Kode Aset</th>
                                    <th className="px-2 py-2.5 w-[180px]">Nama Aset</th>
                                    <th className="px-2 py-2.5 w-[110px] whitespace-nowrap">Serial Number</th>
                                    <th className="px-2 py-2.5 w-[90px] whitespace-nowrap">Tgl Beli</th>
                                    <th className="px-2 py-2.5 w-[120px]">User</th>
                                    <th className="px-2 py-2.5 w-[150px]">Lokasi</th>
                                    <th className="px-2 py-2.5 w-[130px] whitespace-nowrap">Keberadaan</th>
                                    <th className="px-2 py-2.5 w-[140px] whitespace-nowrap">Kondisi Fisik</th>
                                    <th className="px-2 py-2.5 min-w-[140px]">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAssets.map((asset, index) => (
                                    <tr key={asset.id} className={`transition ${isFrozen ? 'bg-gray-50/30' : 'hover:bg-gray-50'}`}>
                                        <td className="px-2 py-2.5 align-top text-sm text-gray-500 text-center w-[45px]">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 py-2.5 align-top font-mono text-xs text-gray-600 w-[130px]">
                                            {asset.kode_aset}
                                        </td>
                                        <td className="px-2 py-2.5 align-top w-[180px]">
                                            <div className="font-medium text-gray-900 text-sm leading-tight">{asset.nama_aset}</div>
                                            {savingId === asset.id && (
                                                <span className="text-[10px] text-indigo-500 animate-pulse block">Saving...</span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2.5 align-top text-xs text-gray-600 font-mono w-[110px]">
                                            {asset.serial_number || '-'}
                                        </td>
                                        <td className="px-2 py-2.5 align-top text-xs text-gray-600 w-[90px]">
                                            {asset.tanggal_beli ? new Date(asset.tanggal_beli).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-2 py-2.5 align-top w-[120px]">
                                            {isFrozen ? (
                                                <div className="text-sm text-gray-700 py-0.5">
                                                    {asset.opname_nama_user || '-'}
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={asset.opname_nama_user}
                                                        onChange={(e) => updateLocal(asset.id, 'opname_nama_user', e.target.value)}
                                                        onBlur={(e) => updateRecord(asset.id, 'opname_nama_user', e.target.value)}
                                                        placeholder="..."
                                                        className="w-full text-xs border-gray-200 rounded px-2 py-1.5 focus:ring-[#b8860b] focus:border-[#b8860b]"
                                                    />
                                                    {asset.opname_nama_user && asset.opname_nama_user !== asset.nama_user && (
                                                        <div className="text-[10px] text-orange-500 mt-1">
                                                            Pindah tangan: {asset.nama_user || '-'} &rarr; {asset.opname_nama_user}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-2 py-2.5 align-top w-[150px]">
                                            {isFrozen ? (
                                                <div className="text-sm text-gray-700 py-0.5">
                                                    {asset.lokasi || '-'}
                                                    {asset.lokasi && asset.lokasi !== location && (
                                                        <div className="text-[10px] text-orange-500 mt-1">
                                                            Pindah: {location} &rarr; {asset.lokasi}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <select
                                                        value={asset.lokasi}
                                                        onChange={(e) => updateRecord(asset.id, 'lokasi', e.target.value)}
                                                        className="w-full text-xs rounded border-gray-200 focus:ring-[#b8860b] focus:border-[#b8860b] py-1.5 px-2"
                                                    >
                                                        {allLocations.map((loc, idx) => (
                                                            <option key={idx} value={loc}>{loc}</option>
                                                        ))}
                                                    </select>
                                                    {asset.lokasi && asset.lokasi !== location && (
                                                        <div className="text-[10px] text-orange-500 mt-1">
                                                            Pindah: {location} &rarr; {asset.lokasi}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-2 py-2.5 align-top w-[130px]">
                                            {isFrozen ? (
                                                <div className="flex gap-1.5">
                                                    {asset.opname_status === 'ada' ? (
                                                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">Ada</span>
                                                    ) : asset.opname_status === 'hilang' ? (
                                                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">Hilang</span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200 italic">Belum Dicek</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 whitespace-nowrap">
                                                    <button
                                                        onClick={() => updateRecord(asset.id, 'opname_status', asset.opname_status === 'ada' ? null : 'ada')}
                                                        className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                                                            asset.opname_status === 'ada'
                                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Ada
                                                    </button>
                                                    <button
                                                        onClick={() => updateRecord(asset.id, 'opname_status', asset.opname_status === 'hilang' ? null : 'hilang')}
                                                        className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                                                            asset.opname_status === 'hilang'
                                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        Hilang
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2.5 align-top w-[140px]">
                                            {isFrozen ? (
                                                asset.opname_status === 'ada' ? (
                                                    <span className={`text-sm ${asset.opname_kondisi === 'Rusak' ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {asset.opname_kondisi || '-'}
                                                    </span>
                                                ) : asset.opname_status === 'hilang' ? (
                                                    <span className="text-xs text-red-500 italic">- Aset Hilang -</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">- Belum Dicek -</span>
                                                )
                                            ) : (
                                                <>
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
                                                                className={`w-full text-xs rounded-lg border-gray-200 focus:ring-[#b8860b] focus:border-[#b8860b] py-1.5 px-2 ${
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
                                                                    className="w-full text-xs rounded-lg border-gray-300 focus:ring-[#b8860b] focus:border-[#b8860b] py-1.5 px-2"
                                                                    autoFocus
                                                                />
                                                                <button 
                                                                    onClick={() => updateRecord(asset.id, 'opname_kondisi', 'Bagus')}
                                                                    className="text-gray-400 hover:text-red-500 p-1 text-sm"
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
                                                    
                                                    {asset.opname_kondisi !== asset.kondisi_aset && asset.opname_status === 'ada' && (
                                                        <div className="text-[10px] text-orange-500 mt-1">
                                                            Master: {asset.kondisi_aset} &rarr; Update
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-2 py-2.5 min-w-[140px]">
                                            {isFrozen ? (
                                                <span className="text-sm text-gray-600">{asset.catatan || '-'}</span>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={asset.catatan}
                                                    onChange={(e) => updateLocal(asset.id, 'catatan', e.target.value)}
                                                    onBlur={(e) => updateRecord(asset.id, 'catatan', e.target.value)}
                                                    placeholder="..."
                                                    className="w-full text-xs border-gray-200 rounded px-2 py-1.5 focus:ring-[#b8860b] focus:border-[#b8860b]"
                                                />
                                            )}
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
