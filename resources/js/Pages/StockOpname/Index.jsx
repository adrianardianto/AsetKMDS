import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Index({ periods }) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        judul: '',
        keterangan: '',
        tanggal_mulai: new Date().toISOString().split('T')[0],
    });

    const [editingPeriod, setEditingPeriod] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [verificationText, setVerificationText] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (editingPeriod) {
            put(`/stock-opname/${editingPeriod.id}`, {
                onSuccess: () => {
                    setIsCreating(false);
                    setEditingPeriod(null);
                    reset();
                },
            });
        } else {
            const url = typeof route === 'function' ? route('stock-opname.store') : '/stock-opname';
            post(url, {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (period) => {
        setEditingPeriod(period);
        setData({
            judul: period.judul,
            keterangan: period.keterangan || '',
            tanggal_mulai: period.tanggal_mulai,
        });
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
        setVerificationText('');
    };

    const cleanupDelete = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setVerificationText('');
    };

    const executeDelete = () => {
        if (verificationText === 'Hapus') {
            router.delete(`/stock-opname/${deleteId}`, {
                preserveScroll: true,
                onSuccess: () => cleanupDelete(),
            });
        }
    };

    const cancelEdit = () => {
        setIsCreating(false);
        setEditingPeriod(null);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Stock Opname" />

            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Opname</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Kelola periode opname aset.</p>
                    </div>
                    <button
                        onClick={() => isCreating ? cancelEdit() : setIsCreating(true)}
                        className={`text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            isCreating 
                                ? 'bg-gray-500 hover:bg-gray-600' 
                                : 'bg-[#b8860b] hover:bg-[#8b6508]'
                        }`}
                    >
                        {isCreating ? 'Batal' : '+ Buat Periode Baru'}
                    </button>
                </div>

                {isCreating && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-fade-in-down">
                        <h3 className="font-bold text-gray-800 mb-4">{editingPeriod ? 'Edit Periode' : 'Buat Periode Baru'}</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Opname</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 focus:ring-[#b8860b] focus:border-[#b8860b]"
                                    placeholder="Contoh: SO 2026"
                                    value={data.judul}
                                    onChange={e => setData('judul', e.target.value)}
                                    required
                                />
                                {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 focus:ring-[#b8860b] focus:border-[#b8860b]"
                                    value={data.tanggal_mulai}
                                    onChange={e => setData('tanggal_mulai', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 focus:ring-[#b8860b] focus:border-[#b8860b]"
                                    placeholder="Opsional..."
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#b8860b] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8b6508] transition disabled:opacity-50"
                                >
                                    {editingPeriod ? 'Simpan Perubahan' : 'Simpan & Buat'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {periods.map((period) => (
                        <div
                            key={period.id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative flex flex-col justify-between h-[220px]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 pr-2">
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#b8860b] transition leading-tight mb-2">
                                            <Link href={`/stock-opname/${period.id}`}>
                                                {period.judul}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {new Date(period.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 shrink-0 ${
                                        period.status === 'Aktif' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${period.status === 'Aktif' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        {period.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {period.keterangan || 'Tidak ada keterangan tambahan.'}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(period)}
                                        className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition font-medium"
                                        title="Edit Periode"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(period.id)}
                                        className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
                                        title="Hapus Periode"
                                    >
                                        Hapus
                                    </button>
                                </div>
                                <Link 
                                    href={`/stock-opname/${period.id}`} 
                                    className="text-xs bg-[#b8860b] text-white px-4 py-2 rounded-lg hover:bg-[#8b6508] transition font-medium flex items-center gap-2 shadow-sm"
                                >
                                    <span>Buka</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {periods.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Belum ada periode opname. Silakan buat baru.</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Konfirmasi Penghapusan</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Apakah Anda yakin ingin menghapus Stock Opname ini?
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ketik <span className="font-mono font-bold text-red-600">"Hapus"</span> untuk melanjutkan

                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 focus:ring-red-500 focus:border-red-500 text-center"
                                placeholder="Hapus"
                                value={verificationText}
                                onChange={(e) => setVerificationText(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cleanupDelete}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={executeDelete}
                                disabled={verificationText !== 'Hapus'}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hapus Permanen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
