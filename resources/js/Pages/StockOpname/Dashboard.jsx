import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Dashboard({ period, locations, totalAssets, totalChecked }) {
    const overallPercentage = totalAssets > 0 ? Math.round((totalChecked / totalAssets) * 100) : 0;

    return (
        <MainLayout>
            <Head title={`Dashboard - ${period.judul}`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/stock-opname" className="hover:text-indigo-600">Stock Opname</Link>
                        <span>/</span>
                        <span>Dashboard</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{period.judul}</h1>
                    <p className="text-gray-500 mt-1">{period.keterangan || 'Tidak ada keterangan'}</p>
                </div>

                {/* Global Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Progress Keseluruhan</span>
                            <div className="text-3xl font-bold text-gray-900 mt-1">
                                {overallPercentage}% <span className="text-lg text-gray-400 font-normal">({totalChecked} / {totalAssets} Aset)</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            period.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                            Status: {period.status}
                        </span>
                        {period.status === 'Aktif' && (
                            <Link 
                                href={`/stock-opname/${period.id}/complete`}
                                method="post"
                                as="button"
                                className="ml-4 text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
                                onClick={(e) => {
                                    if(!confirm('Apakah Anda yakin ingin menyelesaikan periode ini? Data tidak bisa diubah lagi setelah selesai.')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Selesaikan Periode
                            </Link>
                        )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${overallPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <h3 className="font-bold text-gray-800 mb-4 text-lg">Pilih Lokasi Pengerjaan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((loc, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-900 text-lg">{loc.name}</h4>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
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
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            loc.percentage === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                        }`}
                                        style={{ width: `${loc.percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link 
                                href={`/stock-opname/${period.id}/action?lokasi=${encodeURIComponent(loc.name)}`}
                                className="block w-full text-center py-2 rounded-lg bg-white border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition"
                            >
                                {loc.percentage === 100 ? 'Review Ulang' : 'Mulai Cek'}
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
