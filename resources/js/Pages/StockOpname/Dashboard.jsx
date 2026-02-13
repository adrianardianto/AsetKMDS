import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Dashboard({ period, locations, totalAssets, totalChecked }) {
    const overallPercentage = totalAssets > 0 ? Math.round((totalChecked / totalAssets) * 100) : 0;
    const [showModal, setShowModal] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');
    const [showReopenModal, setShowReopenModal] = useState(false);
    const [reopenConfirmInput, setReopenConfirmInput] = useState('');
    const isFrozen = period.status === 'Selesai';

    return (
        <MainLayout>
            <Head title={`Dashboard - ${period.judul}`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{period.judul}</h1>
                            <p className="text-gray-500 mt-1">{period.keterangan || 'Tidak ada keterangan'}</p>
                        </div>
                        {isFrozen && (
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Data Terkunci — Snapshot Historis</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border mb-8 ${isFrozen ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-100'}`}>
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

                <h3 className="font-bold text-gray-800 mb-4 text-lg">
                    {isFrozen ? 'Lokasi (Snapshot Historis)' : 'Pilih Lokasi Pengerjaan'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
        </MainLayout>
    );
}
