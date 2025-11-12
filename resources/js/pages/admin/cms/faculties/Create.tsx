import React, { useState } from 'react';
import { Faculty } from './columns';

// Import komponen dasar dari Index.tsx
// Catatan: Di lingkungan nyata, ini akan diimpor dari lokasi terpusat.

interface BreadcrumbItem {
    title: string;
    href: string;
}

const CustomAlert: React.FC<{ message: string; type: 'success' | 'error' }> = ({
    message,
    type,
}) => {
    const baseClass = 'p-4 rounded-lg flex items-center space-x-3';
    const successClass =
        'bg-green-100 border-l-4 border-green-500 text-green-800';
    const errorClass = 'bg-red-100 border-l-4 border-red-500 text-red-800';
    const icon = type === 'success' ? '📢' : '⚠️';
    return (
        <div
            className={`${baseClass} ${type === 'success' ? successClass : errorClass} mb-4`}
        >
            <span className="text-xl">{icon}</span>
            <div>
                <h4 className="font-bold">Notifikasi</h4>
                <p>{message}</p>
            </div>
        </div>
    );
};

const CustomButton: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
> = ({ children, className, ...props }) => (
    <button
        className={`rounded-md px-4 py-2 font-semibold text-white transition duration-150 ease-in-out ${className}`}
        {...props}
    >
        {children}
    </button>
);

const AppLayout: React.FC<{
    children: React.ReactNode;
    breadcrumbs: BreadcrumbItem[];
}> = ({ children, breadcrumbs }) => (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                <nav className="text-sm text-gray-500">
                    {breadcrumbs.map((item, index) => (
                        <span key={item.title}>
                            {index > 0 && <span className="mx-2">/</span>}
                            <a href={item.href} className="hover:text-gray-700">
                                {item.title}
                            </a>
                        </span>
                    ))}
                </nav>
            </div>
        </header>
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
        </main>
    </div>
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fakultas',
        href: '/faculties/index',
    },
    {
        title: 'Tambah',
        href: '/faculties/create',
    },
];

const API_ENDPOINT = '/api/faculties';

export default function Create() {
    const [formData, setFormData] = useState<
        Omit<Faculty, 'id_fakultas' | 'created_at' | 'updated_at'>
    >({
        nama_fakultas: '',
        singkatan: '',
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccessMessage(null);

        // Data yang akan dikirim (menggunakan nama kolom Laravel: faculty_name, abbreviation)
        const payload = {
            faculty_name: formData.nama_fakultas,
            abbreviation: formData.singkatan || null,
        };

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Asumsi Laravel mengembalikan error validasi
                if (errorData.errors) {
                    const messages = Object.values(errorData.errors)
                        .flat()
                        .join('; ');
                    throw new Error(messages);
                }
                throw new Error(errorData.message || 'Gagal menyimpan data.');
            }

            // Sukses
            setSuccessMessage(
                `Fakultas "${formData.nama_fakultas}" berhasil ditambahkan!`,
            );
            setFormData({ nama_fakultas: '', singkatan: '' }); // Reset form
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Terjadi kesalahan tidak terduga.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <title>Tambah Fakultas</title>

            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Tambah Fakultas Baru
                </h1>

                {error && <CustomAlert message={error} type="error" />}
                {successMessage && (
                    <CustomAlert message={successMessage} type="success" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="nama_fakultas"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nama Fakultas (Maks. 100 karakter)
                        </label>
                        <input
                            type="text"
                            name="nama_fakultas"
                            id="nama_fakultas"
                            value={formData.nama_fakultas}
                            onChange={handleInputChange}
                            maxLength={100}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="singkatan"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Singkatan (Maks. 10 karakter, Opsional)
                        </label>
                        <input
                            type="text"
                            name="singkatan"
                            id="singkatan"
                            value={formData.singkatan || ''}
                            onChange={handleInputChange}
                            maxLength={10}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-between">
                        <a href="/faculties/index">
                            <CustomButton
                                className="bg-gray-500 hover:bg-gray-600"
                                type="button"
                            >
                                Kembali ke Daftar
                            </CustomButton>
                        </a>
                        <CustomButton
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Fakultas'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
