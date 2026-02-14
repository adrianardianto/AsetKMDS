import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function UpdateAset({ asets, filters = {} }) {
    // Filter
    const [search, setSearch] = useState(filters.search || '');
    const [tipe, setTipe] = useState(filters.tipe || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [kondisi, setKondisi] = useState(filters.kondisi || '');
    const [showFilters, setShowFilters] = useState(false);

    const getExportUrl = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return `/update-aset/export?${params.toString()}`;
    };

    // Auto-filter
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/update-aset',
                { search, tipe, kategori, jenis, kondisi },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [search, tipe, kategori, jenis, kondisi]);

    const handleReset = () => {
        setSearch('');
        setTipe('');
        setKategori('');
        setJenis('');
        setKondisi('');
        router.get('/update-aset', {}, { preserveState: true, replace: true });
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        const now = new Date();
        const formattedDate = now.toLocaleString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        }).replace(/\//g, '-');
        
        document.title = `Cetak Asset - ${formattedDate}`;
        window.print();
        
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };
    return (
        <MainLayout>
            <Head title="Update Aset" />
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0mm;
                    }
                    
                    /* Hide Structural Elements (Sidebar, Navbar, etc) */
                    nav, aside, header, footer, .fixed, .sticky {
                        display: none !important;
                    }
                    
                    /* Reset Main Content Layout */
                    main {
                        height: auto !important;
                        overflow: visible !important;
                        display: block !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    /* Reset Body & HTML */
                    html, body {
                        background-color: #ffffff !important;
                        height: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact;
                    }

                    /* Reset App Wrapper to prevent extra pages */
                    #app, .min-h-screen, [data-page] {
                        margin: 0 !important;
                        padding: 0 !important;
                        min-height: 0 !important;
                        height: auto !important;
                    }

                    /* Reset all backgrounds to transparent or white */
                    *, *::before, *::after {
                        background-color: transparent !important;
                        color: #000 !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }

                    /* Specific overrides */
                    .bg-slate-50, .bg-gray-50, .bg-white {
                        background-color: transparent !important;
                        border: none !important;
                    }

                    .print-header {
                        display: block !important;
                        text-align: center;
                        margin-bottom: 20px;
                        padding-top: 0;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                    
                    /* Clean Table Styling */
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 2px solid #000;
                        font-size: 9pt;
                        margin-bottom: 0 !important;
                    }
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 4px 6px !important;
                        text-align: left;
                        vertical-align: top;
                        color: #000 !important;
                        background-color: transparent !important;
                        white-space: normal !important;
                    }
                    thead th {
                        font-weight: bold;
                        text-align: center !important;
                        background-color: transparent !important;
                        color: #000 !important;
                        border-bottom: 2px solid #000 !important;
                    }
                    
                    th:first-child, td:first-child {
                        width: 1% !important;
                        white-space: nowrap !important;
                        text-align: center !important;
                    }
                    
                    /* Widen Nama Aset Column */
                    th:nth-child(3), td:nth-child(3) {
                        width: 15% !important;
                    }

                    /* Flatten Status Badges */
                    .print-status {
                        background-color: transparent !important;
                        color: #000 !important;
                        font-weight: normal !important;
                        padding: 0 !important;
                        border: none !important;
                    }
                    
                    /* Remove shadows and rounded corners */
                    .shadow-sm, .rounded-xl, .border, .border-slate-200 {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        border: none !important;
                    }
                    
                    /* Ensure table full width and visible */
                    .max-w-7xl { 
                        max-width: none !important; 
                        width: 100% !important; 
                        margin: 0 !important; 
                        padding: 10mm !important;
                        overflow: hidden !important;
                    }
                }
                .print-header {
                    display: none;
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                <div className="print-header">
                    <h1 className="text-2xl font-bold text-black mb-1">Laporan Data Aset</h1>
                    <p className="text-sm text-black">Tanggal Cetak: {new Date().toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Master Data Aset</h1>
                        <p className="text-gray-500 mt-1">Kelola dan update data aset yang telah tercatat.</p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                        <a 
                            href={getExportUrl()}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                        >
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Export CSV
                        </a>
                        <button 
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Print/PDF
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-6 print:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
                        {/* Search keyword */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                             <div className="flex justify-between items-center lg:hidden mb-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Cari Aset</label>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="text-xs font-bold text-kmds-gold hover:text-yellow-600"
                                >
                                    {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                                </button>
                             </div>
                             <label className="text-xs font-semibold text-gray-600 uppercase hidden lg:block">Cari Aset</label>
                             
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nama/Kode/SN/User"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full transition-shadow"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Collapsible Filters Container */}
                        <div className={`contents ${showFilters ? 'block' : 'hidden'} lg:contents`}>
                            {/* Tipe Filter */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Tipe</label>
                                <select 
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full"
                                    value={tipe}
                                    onChange={(e) => setTipe(e.target.value)}
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="Bangunan 1">Bangunan 1</option>
                                    <option value="Bangunan 2">Bangunan 2</option>
                                    <option value="Kendaraan">Kendaraan</option>
                                    <option value="Mesin & Peralatan">Mesin & Peralatan</option>
                                    <option value="Peralatan Kantor 1">Peralatan Kantor 1</option>
                                    <option value="Peralatan Kantor 2">Peralatan Kantor 2</option>
                                    <option value="Peralatan Show Room 1">Peralatan Show Room 1</option>
                                    <option value="Peralatan Show Room 2">Peralatan Show Room 2</option>
                                    <option value="Tanah">Tanah</option>
                                </select>
                            </div>

                            {/* Kategori Filter */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Kategori</label>
                                <select 
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full"
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value)}
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="Elektronik">Elektronik</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Kendaraan">Kendaraan</option>
                                    <option value="Mesin">Mesin</option>
                                </select>
                            </div>

                            {/* Divisi Filter */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Jenis Aset</label>
                                <select 
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full"
                                    value={jenis}
                                    onChange={(e) => setJenis(e.target.value)}
                                >
                                    <option value="">Semua Jenis</option>
                                    <option value="Accounting">Accounting</option>
                                    <option value="General Affair">General Affair</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>


                            {/* Kondisi Filter */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Kondisi</label>
                                <select 
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full"
                                    value={kondisi}
                                    onChange={(e) => setKondisi(e.target.value)}
                                >
                                    <option value="">Semua Kondisi</option>
                                    <option value="Bagus">Bagus</option>
                                    <option value="Rusak">Rusak</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                 {(search || tipe || kategori || jenis || kondisi) && (
                                    <button 
                                        onClick={handleReset}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider w-12 text-center">
                                        No
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Kode Aset
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Nama Aset
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Serial Number
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Tipe Aset
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                     <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Jenis Aset
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                     <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Tanggal Beli
                                    </th>
                                     <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Umur
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                        Keterangan
                                    </th>
                                    <th scope="col" className="relative px-4 py-2 print:hidden">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {asets.length > 0 ? (
                                    asets.map((aset, index) => (
                                        <tr key={aset.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs font-medium text-gray-900">
                                                {aset.kode_aset}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">
                                                {aset.nama_aset}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.serial_number}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.tipe_aset}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.kategori_aset}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.jenis_aset}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.lokasi}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.nama_user}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.tanggal_beli}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.umur_aset} Tahun
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                Rp {new Intl.NumberFormat('id-ID').format(aset.harga_aset)}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full print-status ${
                                                    aset.kondisi_aset === 'Bagus' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : aset.kondisi_aset === 'Rusak'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {aset.kondisi_aset}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                                                {aset.keterangan || '-'}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap text-right text-xs font-medium print:hidden">
                                                <Link 
                                                    href={`/update-aset/${aset.id}/edit`} 
                                                    className="text-kmds-gold hover:text-yellow-600 font-medium"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="14" className="px-6 py-12 text-center text-gray-500">
                                            Belum ada data aset. 
                                            <Link href="/pencatatan" className="text-kmds-gold hover:underline ml-1">
                                                Catat aset baru
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 print:hidden">
                        <div className="text-sm text-gray-500">
                            Menampilkan {asets.length} data aset
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

