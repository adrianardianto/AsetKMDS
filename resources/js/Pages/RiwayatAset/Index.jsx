import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function RiwayatAset({ riwayat, filters }) {
    const [expandedRows, setExpandedRows] = useState([]);
    
    // Filter
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = () => {
        router.get(
            '/riwayat-aset',
            { search, start_date: startDate, end_date: endDate },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        router.get('/riwayat-aset', {}, { preserveState: true, replace: true });
    };

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const formatDate = (dateString, isManual = false) => {
        if (!dateString) return isManual ? '-' : 'Invalid Date';
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            return isManual ? '-' : 'Invalid Date';
        }
    };

    const formatChanges = (changes) => {
        if (!changes || typeof changes !== 'object') return null;
        
        return (
            <div className="w-full mt-3">
                <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-2 mb-2 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    <div>Field</div>
                    <div className="text-red-500">Data Sebelumnya</div>
                    <div className="text-green-600">Setelah Edit</div>
                </div>
                {Object.entries(changes).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                        <div className="break-words font-mono text-xs self-start">
                            <div className="bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 inline-block">
                                {value.old !== null && value.old !== '' ? 
                                    (Date.parse(value.old) && (key.includes('waktu') || key.includes('date') || key.includes('tanggal')) ? formatDate(value.old, true) : value.old) 
                                    : <span className="italic opacity-70">Null/Kosong</span>}
                            </div>
                        </div>
                        <div className="break-words font-mono text-xs self-start">
                            <div className="bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100 inline-block">
                                {value.new !== null && value.new !== '' ? 
                                    (Date.parse(value.new) && (key.includes('waktu') || key.includes('date') || key.includes('tanggal')) ? formatDate(value.new, true) : value.new) 
                                    : <span className="italic opacity-70">Null/Kosong</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Riwayat Aset" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Riwayat Aset</h1>
                        <p className="text-gray-500 mt-1">Setiap aktivitas perubahan data aset akan tercatat disini.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari aset, user..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full sm:w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                             <input
                                type="date"
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Dari Tanggal"
                            />
                            <span className="text-gray-400 hidden sm:inline">-</span>
                            <input
                                type="date"
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Sampai Tanggal"
                            />
                        </div>

                        <button 
                            onClick={handleFilter}
                            className="bg-kmds-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                        >
                            Filter
                        </button>
                        
                        {(search || startDate || endDate) && (
                            <button 
                                onClick={handleReset}
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Waktu Input
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 yellow-header-highlight uppercase tracking-wider">
                                        Waktu Pengerjaan
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Aset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {riwayat.length > 0 ? (
                                    riwayat.map((log) => (
                                        <React.Fragment key={log.id}>
                                            <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleRow(log.id)}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {log.waktu_pengerjaan ? formatDate(log.waktu_pengerjaan, true) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {log.aset ? (
                                                        <div>
                                                            <div className="text-gray-900">{log.aset.nama_aset}</div>
                                                            <div className="text-xs text-gray-500">{log.aset.kode_aset}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-red-500 italic">Aset dihapus</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.user ? log.user.name : 'Unknown'}
                                                </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate group cursor-help" title={log.description}>
                                                    {log.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={(e) => { e.stopPropagation(); toggleRow(log.id); }} className="text-kmds-gold hover:text-yellow-600">
                                                        {expandedRows.includes(log.id) ? 'Tutup' : 'Detail'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedRows.includes(log.id) && (
                                                <tr className="bg-slate-50">
                                                    <td colSpan="7" className="px-6 py-4">
                                                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Deskripsi Lengkap</h4>
                                                                <p className="text-sm text-gray-800">{log.description}</p>
                                                            </div>

                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detail Perubahan</h4>
                                                            {formatChanges(log.changes)}
                                                            {!log.changes && <p className="text-sm text-gray-500 italic">Tidak ada detail perubahan tercatat.</p>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            Belum ada riwayat tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Menampilkan {riwayat.length} data riwayat
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
