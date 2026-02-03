import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Dashboard() {
    return (
        <MainLayout>
            <Head title="Dashboard" />
            
            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Aset</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">1,245</p>
                    <span className="text-green-500 text-sm font-medium mt-1 inline-block">+12% dari bulan lalu</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Aset Dimusnahkan</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">45</p>
                    <span className="text-green-500 text-sm font-medium mt-1 inline-block">+12% dari bulan lalu</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Nilai Aset</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">Rp 1.2M</p>
                    <span className="text-gray-400 text-sm font-medium mt-1 inline-block">Estimasi saat ini</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang di Asset Management System</h1>
                <p className="text-gray-600 leading-relaxed">
                    Sistem ini membantu perusahaan dalam mengelola data aset secara terpusat, mencakup pencatatan aset, 
                    peminjaman, pemeliharaan, hingga pemusnahan, sehingga proses pengelolaan aset menjadi lebih terintegrasi.
                </p>
            </div>
        </MainLayout>
    );
}
