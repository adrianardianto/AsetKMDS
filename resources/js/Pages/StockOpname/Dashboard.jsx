import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import axios from 'axios';

export default function Dashboard({ period, locations, totalAssets, totalChecked }) {
    const overallPercentage = totalAssets > 0 ? Math.round((totalChecked / totalAssets) * 100) : 0;
    const [showModal, setShowModal] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');
    const [showReopenModal, setShowReopenModal] = useState(false);
    const [reopenConfirmInput, setReopenConfirmInput] = useState('');
    const isFrozen = period.status === 'Selesai';
    const [allAssets, setAllAssets] = useState([]);

    // Fetch all assets data for print
    useEffect(() => {
        const fetchAllAssets = async () => {
            try {
                const response = await axios.get(`/stock-opname/${period.id}/all-assets`);
                setAllAssets(response.data.assets || []);
            } catch (error) {
                console.error('Failed to fetch assets:', error);
            }
        };
        fetchAllAssets();
    }, [period.id]);

    const handlePrint = () => {
        const originalTitle = document.title;
        const now = new Date();
        const formattedDate = now.toLocaleString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        }).replace(/\//g, '-');
        
        document.title = `Laporan Stock Opname - ${period.judul} - ${formattedDate}`;
        window.print();
        
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    return (
        <MainLayout>
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0mm;
                    }
                    
                    nav, aside, header, footer, .fixed, .sticky {
                        display: none !important;
                    }
                    
                    main {
                        height: auto !important;
                        overflow: visible !important;
                        display: block !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    html, body {
                        background-color: #ffffff !important;
                        height: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact;
                    }

                    #app, .min-h-screen, [data-page] {
                        margin: 0 !important;
                        padding: 0 !important;
                        min-height: 0 !important;
                        height: auto !important;
                    }

                    *, *::before, *::after {
                        background-color: transparent !important;
                        color: #000 !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }

                    .print-header {
                        display: block !important;
                        text-align: center;
                        margin-bottom: 20px;
                        padding-top: 20px;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                    .print-visible {
                        display: block !important;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 2px solid #000;
                        font-size: 8pt;
                        margin-bottom: 0 !important;
                    }
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 3px 5px !important;
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
                    
                    .max-w-6xl { 
                        max-width: none !important; 
                        width: 100% !important; 
                        margin: 0 !important; 
                        padding: 10mm !important;
                    }
                }
                .print-header {
                    display: none;
                }
                .print-visible {
                    display: none;
                }
            `}</style>
            <Head title={`Dashboard - ${period.judul}`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8 print:hidden">
                    <div className="mb-4">
                        <Link 
                            href="/stock-opname" 
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:text-[#b8860b] hover:border-[#b8860b] hover:bg-[#b8860b]/5 transition-all shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Stock Opname
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{period.judul}</h1>
                            <p className="text-gray-500 mt-1">{period.keterangan || 'Tidak ada keterangan'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isFrozen && (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Data Terkunci — Snapshot Historis</span>
                                </div>
                            )}
                            <a 
                                href={`/stock-opname/${period.id}/export-all`}
                                target="_blank"
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export CSV
                            </a>
                            <button 
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                Print/PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border mb-8 print:hidden ${isFrozen ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Progress Keseluruhan</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold text-gray-900">{overallPercentage}%</span>
                                <span className="text-sm text-gray-500">({totalChecked} / {totalAssets} Aset)</span>
                            </div>
                        </div>
                        {period.status === 'Aktif' ? (
                            <button 
                                className="w-auto ml-auto md:ml-0 text-xs text-red-600 bg-white border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm font-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowModal(true);
                                }}
                            >
                                Selesaikan Periode SO
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowReopenModal(true)}
                                className="w-auto ml-auto md:ml-0 text-xs text-green-600 bg-white border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors shadow-sm font-medium"
                            >
                                Aktifkan Kembali
                            </button>
                        )}
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-green-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${overallPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Penyelesaian</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Apakah Anda yakin ingin menyelesaikan periode stock opname ini? 
                                <br/>
                                <span className="text-blue-600 font-medium">Data akan di-snapshot dan menjadi read-only. Data tidak akan berubah walau master data di-update.</span>
                                <br/>
                                <span className="text-gray-500 text-xs mt-1 block">Anda masih bisa mengaktifkan kembali nanti jika diperlukan.</span>
                            </p>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ketik <span className="font-mono font-bold text-red-600">"SELESAI"</span> untuk melanjutkan
                                </label>
                                <input 
                                    type="text" 
                                    value={confirmInput}
                                    onChange={(e) => setConfirmInput(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-center"
                                    placeholder="SELESAI"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => {
                                        setShowModal(false);
                                        setConfirmInput('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <Link
                                    href={`/stock-opname/${period.id}/complete`}
                                    method="post"
                                    as="button"
                                    disabled={confirmInput !== 'SELESAI'}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        confirmInput === 'SELESAI'
                                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={() => setShowModal(false)}
                                >
                                    Selesaikan Periode
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {showReopenModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Pengaktifan Kembali</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Apakah Anda yakin ingin mengaktifkan kembali periode stock opname ini? 
                                <br/>
                                <span className="text-green-600 font-medium">Data snapshot akan dihapus dan kembali real-time. Anda bisa melanjutkan stock opname.</span>
                            </p>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ketik <span className="font-mono font-bold text-green-600">"AKTIFKAN"</span> untuk melanjutkan
                                </label>
                                <input 
                                    type="text" 
                                    value={reopenConfirmInput}
                                    onChange={(e) => setReopenConfirmInput(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-center"
                                    placeholder="AKTIFKAN"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => {
                                        setShowReopenModal(false);
                                        setReopenConfirmInput('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <Link
                                    href={`/stock-opname/${period.id}/reopen`}
                                    method="post"
                                    as="button"
                                    disabled={reopenConfirmInput !== 'AKTIFKAN'}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        reopenConfirmInput === 'AKTIFKAN'
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={() => setShowReopenModal(false)}
                                >
                                    Aktifkan Kembali
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="font-bold text-gray-800 mb-4 text-lg print:hidden">
                    {isFrozen ? 'Lokasi (Snapshot Historis)' : 'Pilih Lokasi Pengerjaan'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
                    {locations.map((loc, index) => (
                        <div key={index} className={`p-5 rounded-xl border transition group ${isFrozen ? 'bg-white/80 border-blue-100 hover:border-blue-300 hover:shadow-md' : 'bg-white border-gray-200 hover:border-[#b8860b] hover:shadow-md'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-[#b8860b] text-lg">{loc.name}</h4>
                                <span className="bg-[#b8860b]/10 text-[#b8860b] text-xs px-2 py-1 rounded">
                                    {loc.total} Aset
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Selesai: {loc.checked}</span>
                                    <span>{loc.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full transition-all duration-500 bg-green-500"
                                        style={{ width: `${loc.percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link 
                                href={`/stock-opname/${period.id}/action?lokasi=${encodeURIComponent(loc.name)}`}
                                className={`block w-full text-center py-2 rounded-lg font-medium transition ${
                                    isFrozen 
                                        ? 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                                        : 'bg-white border border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b] hover:text-white'
                                }`}
                            >
                                {isFrozen ? 'Lihat Data' : (loc.percentage === 100 ? 'Review Ulang' : 'Mulai Cek')}
                            </Link>
                        </div>
                    ))}
                    
                    {locations.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            Tidak ada data lokasi ditemukan di Master Aset.
                        </div>
                    )}
                </div>

                {/* Print Header */}
                <div className="print-header">
                    <h1 className="text-2xl font-bold text-black mb-1">Laporan Stock Opname - {period.judul}</h1>
                    <p className="text-sm text-black">{period.keterangan || 'Tidak ada keterangan'}</p>
                    <p className="text-sm text-black">Tanggal Cetak: {new Date().toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Print Table */}
                <div className="print-visible hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kode Aset</th>
                                <th>Nama Aset</th>
                                <th>Serial Number</th>
                                <th>Kategori</th>
                                <th>Lokasi</th>
                                <th>User</th>
                                <th>Tanggal Beli</th>
                                <th>Keberadaan</th>
                                <th>Kondisi</th>
                                <th>Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAssets.map((asset, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="font-mono">{asset.kode_aset}</td>
                                    <td>{asset.nama_aset}</td>
                                    <td>{asset.serial_number || '-'}</td>
                                    <td>{asset.kategori_aset || '-'}</td>
                                    <td className="text-center">{asset.lokasi || '-'}</td>
                                    <td>{asset.nama_user || '-'}</td>
                                    <td>{asset.tanggal_beli ? new Date(asset.tanggal_beli).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="text-center">
                                        {asset.opname_status === 'ada' ? 'Ada' : 
                                         asset.opname_status === 'hilang' ? 'Hilang' : 'Belum Dicek'}
                                    </td>
                                    <td>{asset.kondisi || '-'}</td>
                                    <td>{asset.catatan || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
