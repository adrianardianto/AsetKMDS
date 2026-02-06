import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Edit({ aset }) {
    // Helper to format price from DB (e.g. 1500000.00) to input format (e.g. 1.500.000)
    const formatPriceInit = (price) => {
        if (price === null || price === undefined) return '';
        // Ensure it's a string (e.g. "1500.88" or 1500.88)
        const priceStr = price.toString();
        // Split integer and decimal parts (DB uses dot)
        const parts = priceStr.split('.');
        
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : ''; 

        // Add dots to integer part
        const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        // Return with comma if decimal exists
        if (decimalPart) {
            return `${formattedInt},${decimalPart}`;
        }
        return formattedInt;
    };

    const { data, setData, put, processing, errors } = useForm({
        tipe_aset: aset.tipe_aset || '',
        jenis_aset: aset.jenis_aset || '',
        kode_aset: aset.kode_aset || '',
        serial_number: aset.serial_number || '',
        nama_aset: aset.nama_aset || '',
        harga_aset: formatPriceInit(aset.harga_aset),
        tanggal_beli: aset.tanggal_beli || '',
        umur_aset: aset.umur_aset || '',
        nama_user: aset.nama_user || '',
        kategori_aset: aset.kategori_aset || '',
        lokasi: aset.lokasi || 'T8',
        kondisi_aset: aset.kondisi_aset || 'Bagus',
        keterangan: aset.keterangan || '',
    });
    
    // Check if current condition is standard or custom
    const standardConditions = ['Bagus', 'Rusak'];
    const [isCustomCondition, setIsCustomCondition] = useState(
        !standardConditions.includes(aset.kondisi_aset)
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

    // Note: We avoid auto-generating kode_aset on EDIT unless strictly needed, 
    // as it might overwrite existing codes if the logic changes. 
    // However, if the user changes 'Tipe Aset', maybe it SHOULD regenerate? 
    // For now, let's keep it safe and ONLY update if the user explicitly changes the type significantly or if it was empty.
    // Actually, usually in edit mode, you don't change the asset code automatically unless requested.
    // I will comment out the auto-generation for now to prevent accidental overwrites of historic data.

    /*
    useEffect(() => {
        if (data.tipe_aset) {
             // ... generation logic ...
        }
    }, [data.tipe_aset]);
    */

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
        put(`/update-aset/${aset.id}`);
    };

    return (
        <MainLayout>
            <Head title="Edit Aset" />

            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8 px-1">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Aset</h1>
                        <p className="text-sm text-gray-500 mt-1">Perbarui informasi aset yang sudah terdaftar.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-4">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-kmds-gold"></span>
                            <h3 className="text-sm font-medium text-gray-900">Formulir Edit</h3>
                        </div>
                    </div>
                    
                    <form onSubmit={submit}>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            
                            {/* Group 1 */}
                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="nama_aset" value="Nama Aset" required />
                                <TextInput 
                                    id="nama_aset" 
                                    type="text" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.nama_aset}
                                    onChange={(e) => setData('nama_aset', e.target.value)}
                                    placeholder="Contoh: Laptop operational"
                                />
                                <InputError message={errors.nama_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="kode_aset" value="Kode Aset" required />
                                <div className="relative mt-1.5">
                                    <TextInput 
                                        id="kode_aset" 
                                        type="text" 
                                        className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                                        value={data.kode_aset}
                                        readOnly
                                        disabled
                                        placeholder="Auto-generated"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="text-gray-400 sm:text-sm">#</span>
                                    </div>
                                </div>
                                <InputError message={errors.kode_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="serial_number" value="Serial Number" />
                                <TextInput 
                                    id="serial_number" 
                                    type="text" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors font-mono"
                                    value={data.serial_number}
                                    onChange={(e) => setData('serial_number', e.target.value)}
                                    placeholder="SN-00000"
                                />
                                <InputError message={errors.serial_number} className="mt-1" />
                            </div>

                            {/* Group 2 */}
                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="tipe_aset" value="Tipe Aset" required />
                                <SelectInput
                                    id="tipe_aset"
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.tipe_aset}
                                    onChange={(e) => setData('tipe_aset', e.target.value)}
                                >
                                    <option value="">Pilih Tipe...</option>
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
                                <InputError message={errors.tipe_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="kategori_aset" value="Kategori" required />
                                <SearchableSelect
                                    id="kategori_aset"
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.kategori_aset}
                                    onChange={(val) => setData('kategori_aset', val)}
                                    options={['Elektronik', 'Furniture', 'Kendaraan', 'Mesin']}
                                    placeholder="Pilih Kategori..."
                                />
                                <InputError message={errors.kategori_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="jenis_aset" value="Divisi / Jenis" required />
                                <SelectInput
                                    id="jenis_aset"
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.jenis_aset}
                                    onChange={(e) => setData('jenis_aset', e.target.value)}
                                >
                                    <option value="">Pilih Divisi...</option>
                                    <option value="Accounting">Accounting</option>
                                    <option value="General Affair">General Affair</option>
                                    <option value="Marketing">Marketing</option>
                                </SelectInput>
                                <InputError message={errors.jenis_aset} className="mt-1" />
                            </div>

                             {/* Group 3 */}
                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="harga_aset" value="Nilai Perolehan" required />
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <span className="text-gray-500 sm:text-sm font-medium">Rp</span>
                                    </div>
                                    <TextInput 
                                        id="harga_aset" 
                                        type="text" 
                                        className="block w-full rounded-lg border-gray-300 pl-11 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                        value={data.harga_aset}
                                        onChange={handleHargaChange}
                                        placeholder="0"
                                    />
                                </div>
                                <InputError message={errors.harga_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="tanggal_beli" value="Tanggal Pembelian" required />
                                <TextInput 
                                    id="tanggal_beli" 
                                    type="date" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.tanggal_beli}
                                    onChange={(e) => setData('tanggal_beli', e.target.value)}
                                />
                                <InputError message={errors.tanggal_beli} className="mt-1" />
                            </div>

                             <div className="lg:col-span-1">
                                <FormLabel htmlFor="umur_aset" value="Estimasi Umur" required />
                                <div className="relative mt-1.5">
                                    <TextInput 
                                        id="umur_aset" 
                                        type="number" 
                                        className="block w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                                        value={data.umur_aset}
                                        readOnly
                                        disabled
                                        placeholder="0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                        <span className="text-gray-400 sm:text-sm">Tahun</span>
                                    </div>
                                </div>
                                <InputError message={errors.umur_aset} className="mt-1" />
                            </div>

                            {/* Group 4 */}
                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="nama_user" value="User Pemakai " required />
                                <TextInput 
                                    id="nama_user" 
                                    type="text" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.nama_user}
                                    onChange={(e) => setData('nama_user', e.target.value)}
                                    placeholder="Nama User"
                                />
                                <InputError message={errors.nama_user} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="lokasi" value="Lokasi Penempatan" required />
                                <SelectInput 
                                    id="lokasi" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                >
                                    <option value="T8">T8</option>
                                    <option value="PIK">PIK</option>
                                    <option value="Bali">Bali</option>
                                    <option value="Cideng">Cideng</option>
                                    <option value="Surabaya">Surabaya</option>
                                </SelectInput>
                                <InputError message={errors.lokasi} className="mt-1" />
                            </div>

                            <div className="lg:col-span-1">
                                <FormLabel htmlFor="kondisi_aset" value="Kondisi Fisik" required />
                                <SelectInput
                                    id="kondisi_aset"
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    value={isCustomCondition ? 'Lainnya' : data.kondisi_aset}
                                    onChange={handleConditionChange}
                                >
                                    <option value="Bagus">Bagus</option>
                                    <option value="Rusak">Rusak</option>
                                    <option value="Lainnya">Lainnya...</option>
                                </SelectInput>
                                {isCustomCondition && (
                                    <TextInput 
                                        id="kondisi_aset_custom"
                                        type="text" 
                                        className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm"
                                        value={data.kondisi_aset}
                                        onChange={(e) => setData('kondisi_aset', e.target.value)}
                                        placeholder="Kondisi spesifik..."
                                        autoFocus
                                    />
                                )}
                                <InputError message={errors.kondisi_aset} className="mt-1" />
                            </div>

                            <div className="lg:col-span-3">
                                <FormLabel htmlFor="keterangan" value="Keterangan" />
                                <textarea 
                                    id="keterangan" 
                                    className="mt-1.5 block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-kmds-gold focus:ring-kmds-gold sm:text-sm hover:border-gray-400 transition-colors"
                                    rows="2"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Catatan tambahan (opsional)..."
                                ></textarea>
                                <InputError message={errors.keterangan} className="mt-1" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end px-8 py-4 bg-gray-50 border-t border-gray-100 gap-3">
                            <Link
                                href="/update-aset"
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kmds-gold focus:ring-offset-2 transition-all"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-lg border border-transparent bg-gray-900 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
                            >
                                Simpan Perubahan
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

function SearchableSelect({ options, value, onChange, placeholder, className, id }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setSearch(value || '');
    }, [value]);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (opt) => {
        onChange(opt);
        setSearch(opt);
        setIsOpen(false);
    };

    const handleBlur = () => {
        // Delay to allow click event to register
        setTimeout(() => {
            const exactMatch = options.find(opt => opt.toLowerCase() === search.toLowerCase());
            if (exactMatch) {
                if (exactMatch !== value) onChange(exactMatch);
                setSearch(exactMatch);
            } else {
                setSearch(value || ''); // Revert if invalid
            }
            setIsOpen(false);
        }, 200);
    };

    return (
        <div className="relative">
             <input
                id={id}
                type="text"
                className={className}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                autoComplete="off"
             />
             {isOpen && filteredOptions.length > 0 && (
                 <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm mt-1">
                     {filteredOptions.map((opt) => (
                         <div
                            key={opt}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-50 hover:text-kmds-gold text-gray-900"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Important: Prevent blur
                                handleSelect(opt);
                            }}
                         >
                             {opt}
                         </div>
                     ))}
                 </div>
             )}
        </div>
    );
}
