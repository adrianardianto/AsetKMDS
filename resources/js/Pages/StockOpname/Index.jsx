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
        if (confirm('Apakah Anda yakin ingin menghapus periode ini? Semua data opname di dalamnya akan terhapus permanen.')) {
            router.delete(`/stock-opname/${id}`, {
                preserveScroll: true,
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
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Stock Opname</h1>
                        <p className="text-sm text-gray-500">Kelola periode opname aset.</p>
                    </div>
                    <button
                        onClick={() => isCreating ? cancelEdit() : setIsCreating(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
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
                                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={data.tanggal_mulai}
                                    onChange={e => setData('tanggal_mulai', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Opsional..."
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
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
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                        <Link href={`/stock-opname/${period.id}`}>
                                            {period.judul}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Dibuat: {new Date(period.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    period.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {period.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-12 line-clamp-2">
                                {period.keterangan || 'Tidak ada keterangan.'}
                            </p>
                            
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center border-t pt-4">
                                <Link href={`/stock-opname/${period.id}`} className="text-xs text-indigo-600 font-medium">
                                    Buka Dashboard &rarr;
                                </Link>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleEdit(period)}
                                        className="text-xs text-gray-500 hover:text-blue-600 font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(period.id)}
                                        className="text-xs text-gray-500 hover:text-red-600 font-medium"
                                    >
                                        Hapus
                                    </button>
                                </div>
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
        </MainLayout>
    );
}
