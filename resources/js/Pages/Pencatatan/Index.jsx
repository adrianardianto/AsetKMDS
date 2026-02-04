import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Pencatatan() {
    const { data, setData, post, processing, errors, reset } = useForm({
        tipe_aset: '',
        jenis_aset: '',
        kode_aset: '',
        serial_number: '',
        nama_aset: '',
        harga_aset: '',
        tanggal_beli: '',
        umur_aset: '',
        nama_user: '',
        kategori_aset: '',
        lokasi: 'T8',
        kondisi_aset: 'Bagus',
        keterangan: '',
    });
    
    const standardConditions = ['Bagus', 'Rusak'];
    const [isCustomCondition, setIsCustomCondition] = useState(
        !standardConditions.includes('Bagus')
    );

    const handleConditionChange = (e) => {
        const val = e.target.value;
        if (val === 'Lainnya') {
            setIsCustomCondition(true);
            setData('kondisi_aset', ''); 
        } else {
            setIsCustomCondition(false);
            setData('kondisi_aset', val);
        }
    };

    const handleHargaChange = (e) => {
        let val = e.target.value;
        let cleanVal = val.replace(/[^0-9,]/g, '');
        const parts = cleanVal.split(',');
        
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : null;
        
        if (integerPart.length > 1 && integerPart.startsWith('0')) {
             integerPart = integerPart.replace(/^0+/, '');
        }

        const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        let finalVal = formattedInt;
        if (parts.length > 1) {
            finalVal += ',' + decimalPart;
        }

        setData('harga_aset', finalVal);
    };

    const toRoman = (num) => {
        const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
        let roman = '';
        for (let i in lookup ) {
            while ( num >= lookup[i] ) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    };

    const getTypeCode = (type) => {
        const mapping = {
            'Bangunan 1': 'GDG',
            'Bangunan 2': 'GDG',
            'Kendaraan': 'KEND',
            'Mesin & Peralatan': 'MSN',
            'Peralatan Kantor 1': 'IK',
            'Peralatan Kantor 2': 'IK',
            'Peralatan Show Room 1': 'IS',
            'Peralatan Show Room 2': 'IS',
            'Tanah': 'TNH',
        };
        return mapping[type] || 'OTH';
    };

    useEffect(() => {
        if (data.tipe_aset) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const romanMonth = toRoman(month);
            const typeCode = getTypeCode(data.tipe_aset);
            const sequence = '0001'; 
            
            const generatedCode = `${year}/${romanMonth}/${typeCode}/${sequence}`;
            setData('kode_aset', generatedCode);
        }
    }, [data.tipe_aset]);

    useEffect(() => {
        if (data.tanggal_beli) {
            const beliDate = new Date(data.tanggal_beli);
            const today = new Date();
            let years = today.getFullYear() - beliDate.getFullYear();
            const m = today.getMonth() - beliDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < beliDate.getDate())) {
                years--;
            }
            setData('umur_aset', Math.max(0, years));
        }
    }, [data.tanggal_beli]);


    const submit = (e) => {
        e.preventDefault();
        post('/pencatatan', {
            onSuccess: () => alert('Asset successfully recorded!'),
        });
    };

    return (
        <MainLayout>
            <Head title="Pencatatan Aset" />

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Pencatatan Aset Baru</h1>
                        <p className="text-gray-500 mt-1">Isi formulir di bawah ini untuk mendaftarkan aset baru ke dalam sistem.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form onSubmit={submit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Informasi Dasar</h3>
                                
                                <div>
                                    <FormLabel htmlFor="nama_aset" value="Nama Aset" required />
                                    <TextInput 
                                        id="nama_aset" 
                                        type="text" 
                                        className="mt-1 block w-full"
                                        value={data.nama_aset}
                                        onChange={(e) => setData('nama_aset', e.target.value)}
                                    />
                                    <InputError message={errors.nama_aset} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel htmlFor="kode_aset" value="Kode Aset" required />
                                        <TextInput 
                                            id="kode_aset" 
                                            type="text" 
                                            className="mt-1 block w-full bg-slate-100 text-slate-500 cursor-not-allowed"
                                            value={data.kode_aset}
                                            readOnly
                                            disabled
                                            placeholder="Auto Generate"
                                        />
                                        <InputError message={errors.kode_aset} className="mt-2" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="serial_number" value="Serial Number" />
                                        <TextInput 
                                            id="serial_number" 
                                            type="text" 
                                            className="mt-1 block w-full"
                                            value={data.serial_number}
                                            onChange={(e) => setData('serial_number', e.target.value)}
                                        />
                                        <InputError message={errors.serial_number} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel htmlFor="tipe_aset" value="Tipe Aset" required />
                                        <SelectInput
                                            id="tipe_aset"
                                            className="mt-1 block w-full"
                                            value={data.tipe_aset}
                                            onChange={(e) => setData('tipe_aset', e.target.value)}
                                        >
                                            <option value="">Pilih Tipe</option>
                                            <option value="Bangunan 1">Bangunan 1</option>
                                            <option value="Bangunan 2">Bangunan 2</option>
                                            <option value="Kendaraan">Kendaraan</option>
                                            <option value="Mesin & Peralatan">Mesin & Peralatan</option>
                                            <option value="Peralatan Kantor 1">Peralatan Kantor 1</option>
                                            <option value="Peralatan Kantor 2">Peralatan Kantor 2</option>
                                            <option value="Peralatan Show Room 1">Peralatan Show Room 1</option>
                                            <option value="Peralatan Show Room 2">Peralatan Show Room 2</option>
                                            <option value="Tanah">Tanah</option>
                                        </SelectInput>
                                        <InputError message={errors.tipe_aset} className="mt-2" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="kategori_aset" value="Kategori Aset" required />
                                        <SelectInput
                                            id="kategori_aset"
                                            className="mt-1 block w-full"
                                            value={data.kategori_aset}
                                            onChange={(e) => setData('kategori_aset', e.target.value)}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            <option value="Elektronik">Elektronik</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Kendaraan">Kendaraan</option>
                                            <option value="Mesin">Mesin</option>
                                        </SelectInput>
                                        <InputError message={errors.kategori_aset} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <FormLabel htmlFor="jenis_aset" value="Jenis Aset" required />
                                    <SelectInput
                                        id="jenis_aset"
                                        className="mt-1 block w-full"
                                        value={data.jenis_aset}
                                        onChange={(e) => setData('jenis_aset', e.target.value)}
                                    >
                                        <option value="">Pilih Jenis</option>
                                        <option value="Accounting">Accounting</option>
                                        <option value="General Affair">General Affair</option>
                                        <option value="Marketing">Marketing</option>
                                    </SelectInput>
                                    <InputError message={errors.jenis_aset} className="mt-2" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Detail & Lokasi</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel htmlFor="harga_aset" value="Harga Aset (Rp)" required />
                                        <TextInput 
                                            id="harga_aset" 
                                            type="text" 
                                            className="mt-1 block w-full"
                                            value={data.harga_aset}
                                            onChange={handleHargaChange}
                                            placeholder="0"
                                        />
                                        <InputError message={errors.harga_aset} className="mt-2" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="tanggal_beli" value="Tanggal Pembelian" required />
                                        <TextInput 
                                            id="tanggal_beli" 
                                            type="date" 
                                            className="mt-1 block w-full"
                                            value={data.tanggal_beli}
                                            onChange={(e) => setData('tanggal_beli', e.target.value)}
                                        />
                                        <InputError message={errors.tanggal_beli} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel htmlFor="umur_aset" value="Umur Aset (Tahun)" required />
                                        <TextInput 
                                            id="umur_aset" 
                                            type="number" 
                                            className="mt-1 block w-full bg-slate-100 text-slate-500 cursor-not-allowed"
                                            value={data.umur_aset}
                                            readOnly
                                            disabled
                                            placeholder="Auto Generate"
                                        />
                                        <InputError message={errors.umur_aset} className="mt-2" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="kondisi_aset" value="Kondisi Saat Ini" required />
                                        <SelectInput
                                            id="kondisi_aset"
                                            className="mt-1 block w-full"
                                            value={isCustomCondition ? 'Lainnya' : data.kondisi_aset}
                                            onChange={handleConditionChange}
                                        >
                                            <option value="Bagus">Bagus</option>
                                            <option value="Rusak">Rusak</option>
                                            <option value="Lainnya">Lainnya (Isi Sendiri)</option>
                                        </SelectInput>
                                        
                                        {isCustomCondition && (
                                            <TextInput 
                                                id="kondisi_aset_custom"
                                                type="text" 
                                                className="mt-2 block w-full"
                                                value={data.kondisi_aset}
                                                onChange={(e) => setData('kondisi_aset', e.target.value)}
                                                placeholder="Tulis kondisi aset..."
                                                autoFocus
                                            />
                                        )}
                                        <InputError message={errors.kondisi_aset} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel htmlFor="nama_user" value="Nama Pengguna/Pemakai" required />
                                        <TextInput 
                                            id="nama_user" 
                                            type="text" 
                                            className="mt-1 block w-full"
                                            value={data.nama_user}
                                            onChange={(e) => setData('nama_user', e.target.value)}
                                            placeholder="Nama Karyawan"
                                        />
                                        <InputError message={errors.nama_user} className="mt-2" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="lokasi" value="Lokasi Aset" required />
                                        <SelectInput 
                                            id="lokasi" 
                                            className="mt-1 block w-full"
                                            value={data.lokasi}
                                            onChange={(e) => setData('lokasi', e.target.value)}
                                        >
                                            <option value="T8">T8</option>
                                            <option value="PIK">PIK</option>
                                            <option value="Bali">Bali</option>
                                            <option value="Cideng">Cideng</option>
                                            <option value="Surabaya">Surabaya</option>
                                        </SelectInput>
                                        <InputError message={errors.lokasi} className="mt-2" />
                                    </div>
                                </div>
                                
                                <div>
                                    <FormLabel htmlFor="keterangan" value="Keterangan Tambahan" />
                                    <textarea 
                                        id="keterangan" 
                                        className="mt-1 block w-full border-slate-300 focus:border-kmds-gold focus:ring-kmds-gold rounded-md shadow-sm text-sm"
                                        rows="3"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Catatan tambahan mengenai aset ini..."
                                    ></textarea>
                                    <InputError message={errors.keterangan} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-8 pt-6 border-t border-slate-100 space-x-4">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kmds-gold transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 text-sm font-medium text-white bg-kmds-gold border border-transparent rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kmds-gold shadow-lg shadow-yellow-100 transition-all"
                            >
                                Simpan Data Aset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

// Simple Components defined here for simplicity, or move to dedicated files
function FormLabel({ htmlFor, value, children, required = false, className = '' }) {
    return (
        <label htmlFor={htmlFor} className={`block font-medium text-sm text-slate-700 mb-1 ${className}`}>
            {value || children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}

function TextInput({ type = 'text', className = '', ...props }) {
    return (
        <input
            {...props}
            type={type}
            className={
                'border-slate-300 focus:border-kmds-gold focus:ring-kmds-gold rounded-md shadow-sm text-sm w-full ' +
                className
            }
        />
    );
}

function SelectInput({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'border-slate-300 focus:border-kmds-gold focus:ring-kmds-gold rounded-md shadow-sm text-sm w-full ' +
                className
            }
        >
            {children}
        </select>
    );
}

function InputError({ message, className = '' }) {
    return message ? (
        <p className={'text-sm text-red-600 ' + className}>{message}</p>
    ) : null;
}

