import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (flash.success) {
            setToastMessage({ type: 'success', text: flash.success });
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash.error) {
            setToastMessage({ type: 'error', text: flash.error });
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();

    }, []);

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            
            <div className={`fixed top-6 right-6 z-[60] transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
                {toastMessage.text && (
                    <div className={`flex items-start p-4 w-80 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 ${
                        toastMessage.type === 'success' ? 'border-l-4 border-kmds-gold' : 'border-l-4 border-red-500'
                    }`}>
                        <div className={`flex-shrink-0 mr-3 ${toastMessage.type === 'success' ? 'text-kmds-gold' : 'text-red-500'}`}>
                            {toastMessage.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm font-bold ${toastMessage.type === 'success' ? 'text-gray-900' : 'text-red-600'}`}>
                                {toastMessage.type === 'success' ? 'Berhasil' : 'Peringatan'}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5 leading-tight">{toastMessage.text}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
            </div>
            
            {/* Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside 
                className={`bg-white text-slate-600 border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-30 overflow-hidden
                fixed inset-y-0 left-0 h-full w-64 shadow-2xl md:shadow-none
                md:relative md:inset-auto md:h-auto md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0 md:w-64' : '-translate-x-full md:w-0'}
                print:hidden
                `}
            >
                <div className="h-auto py-4 flex flex-col items-center justify-center border-b border-slate-100 whitespace-nowrap px-4 flex-shrink-0">
                     <img src="/images/kmdslogo.png" alt="KMDS Logo" className="w-20 h-auto object-contain" />
                    <h1 className="text-lg font-bold tracking-wider truncate text-kmds-gold -mt-1">Asset Management</h1>
                </div>
                
                <nav className="flex-1 mt-6 px-3 space-y-1.5 whitespace-nowrap overflow-y-auto custom-scrollbar">
                    <NavItem href="/" active={url === '/'} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}>Dashboard</NavItem>
                    <NavItem href="/pencatatan" active={url.startsWith('/pencatatan')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}>Pencatatan</NavItem>
                    <NavGroup label="Pemeliharaan" active={url.startsWith('/update-aset') || url.startsWith('/riwayat-aset') || url.startsWith('/stock-opname')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}>
                        <NavItem href="/update-aset" active={url.startsWith('/update-aset')} className="text-xs">Update Aset</NavItem>
                        <NavItem href="/riwayat-aset" active={url.startsWith('/riwayat-aset')} className="text-xs">Riwayat Aset</NavItem>
                        <NavItem href="/stock-opname" active={url.startsWith('/stock-opname')} className="text-xs">Stock Opname</NavItem>
                    </NavGroup>
                    <NavGroup label="Pemusnahan" active={url.startsWith('/pemusnahan')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>}>
                        <NavItem href="#" className="text-xs">Pengajuan Pemusnahan</NavItem>
                        <NavItem href="#" className="text-xs">Riwayat Pemusnahan</NavItem>
                    </NavGroup>
                    <NavItem href="#" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}>Log Aktivitas</NavItem>
                    <NavItem href="#" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}>Kelola User</NavItem>

                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Top Navbar */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 w-full border-b-4 border-kmds-gold print:hidden">
                    
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    {!isSidebarOpen && (
                        <div className="hidden md:flex items-center ml-4 flex-1 transition-all duration-300">
                             <img src="/images/kmdslogo.png" alt="Logo" className="w-12 h-12 object-contain" />
                            <span className="text-lg font-bold text-kmds-gold ml-2 truncate">
                                Asset Management
                            </span>
                        </div>
                    )}

                    <span className="md:hidden flex items-center text-sm font-bold text-kmds-gold ml-1 tracking-tighter truncate flex-1">
                        {!isSidebarOpen ? (
                             <>
                                <img src="/images/kmdslogo.png" alt="Logo" className="w-9 h-9 mr-2 object-contain" />
                                Asset Management
                             </>
                        ) : ''}
                    </span>

                    <div className="flex items-center space-x-2 md:space-x-4 ml-auto flex-shrink-0">
                        <button className="p-2 text-slate-400 hover:text-kmds-gold relative transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 pl-4 border-l border-slate-200 focus:outline-none group"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-kmds-gold transition-colors">Admin User</p>
                                    <p className="text-xs text-slate-500">Administrator</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-kmds-gold font-bold border-2 border-white shadow-sm ring-2 ring-slate-50 group-hover:ring-amber-100 transition-all">
                                    AU
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                                        <Link 
                                            href="#" 
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-kmds-gold transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Pengaturan Akun
                                        </Link>
                                        <div className="border-t border-slate-50"></div>
                                        <Link 
                                            href="#" 
                                            as="button" 
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, children, active = false, icon, className = '' }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                active 
                ? 'bg-kmds-gold text-white shadow-lg shadow-amber-100' 
                : 'text-slate-500 hover:bg-amber-50 hover:text-kmds-gold'
            } ${className}`}
        >
            {icon && <span className={`mr-3 ${active ? 'text-white' : 'text-slate-400 group-hover:text-kmds-gold'}`}>{icon}</span>}
            {children}
        </Link>
    );
}

function NavGroup({ label, icon, children, active = false }) {
    const [isOpen, setIsOpen] = useState(active);

    useEffect(() => {
        if (active) setIsOpen(true);
    }, [active]);

    return (
        <div className="space-y-1">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    active || isOpen
                    ? 'text-kmds-gold bg-amber-50/50' 
                    : 'text-slate-500 hover:bg-amber-50 hover:text-kmds-gold'
                }`}
            >
                <div className="flex items-center">
                    {icon && <span className={`mr-3 ${active || isOpen ? 'text-kmds-gold' : 'text-slate-400 group-hover:text-kmds-gold'}`}>{icon}</span>}
                    {label}
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            
            {isOpen && (
                <div className="pl-8 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-kmds-gold/30">
                    {children}
                </div>
            )}
        </div>
    );
}
