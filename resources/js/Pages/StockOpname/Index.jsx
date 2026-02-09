import React from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <MainLayout>
            <Head title="Stock Opname" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Stock Opname</h2>
                            <p className="mt-4">Halaman Stock Opname akan segera hadir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
