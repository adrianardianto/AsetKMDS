import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function UpdateAset({ asets, filters = {} }) {
    // Filter States
    const [search, setSearch] = useState(filters.search || '');
    const [tipe, setTipe] = useState(filters.tipe || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [kondisi, setKondisi] = useState(filters.kondisi || '');

    const handleFilter = () => {
        router.get(
            '/update-aset',
            { search, tipe, kategori, jenis, kondisi },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setTipe('');
        setKategori('');
        setJenis('');
        setKondisi('');
        router.get('/update-aset', {}, { preserveState: true, replace: true });
    };
    return (
        <MainLayout>
            <Head title="Update Aset" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Data Aset</h1>
                    <p className="text-gray-500 mt-1">Kelola dan update data aset yang telah tercatat.</p>
                </div>

                {/* Filter Section */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
                        {/* Search keyword */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Cari Aset</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nama/Kode/SN"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-kmds-gold focus:border-kmds-gold w-full transition-shadow"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

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
                            <button 
                                onClick={handleFilter}
                                className="flex-1 bg-kmds-gold text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-yellow-200 hover:bg-yellow-600 transition-all hover:shadow-md active:scale-95"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Kode Aset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Nama Aset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Serial Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Tipe Aset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Jenis Aset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Tanggal Beli
                                    </th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Umur
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Keterangan
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {asets.length > 0 ? (
                                    asets.map((aset) => (
                                        <tr key={aset.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {aset.kode_aset}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {aset.nama_aset}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.serial_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.tipe_aset}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.kategori_aset}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.jenis_aset}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.lokasi}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.nama_user}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.tanggal_beli}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.umur_aset} Tahun
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                Rp {new Intl.NumberFormat('id-ID').format(aset.harga_aset)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    aset.kondisi_aset === 'Bagus' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : aset.kondisi_aset === 'Rusak'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {aset.kondisi_aset}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {aset.keterangan || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
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
                    
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Menampilkan {asets.length} data aset
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
