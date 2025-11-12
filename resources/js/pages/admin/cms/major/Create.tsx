import React, { useEffect, useState } from 'react';
import { Faculty } from './columns';

// --- Komponen Dasar (Diambil dari implementasi sebelumnya) ---
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
// --- Akhir Komponen Dasar ---

const API_MAJOR_ENDPOINT = '/api/majors';
const API_FACULTY_ENDPOINT = '/api/faculties';
const JENJANG_OPTIONS = ['D3', 'D4', 'S1', 'S2', 'S3'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Program Studi', href: 'majors/index' },
    { title: 'Tambah', href: '/majors/create' },
];

export default function Create() {
    const [formData, setFormData] = useState({
        nama_prodi: '',
        jenjang: '',
        id_fakultas: '', // String karena dari input select
    });
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch daftar Fakultas untuk dropdown
    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch(API_FACULTY_ENDPOINT);
                if (!response.ok)
                    throw new Error('Gagal memuat daftar fakultas.');
                const data: Faculty[] = await response.json();
                setFaculties(data);
                // Set default fakultas pertama jika ada
                if (data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        id_fakultas: String(data[0].id_fakultas),
                    }));
                }
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : 'Gagal memuat data pendukung.',
                );
            }
        };
        fetchFaculties();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccessMessage(null);

        // Data yang akan dikirim (sesuaikan dengan nama kolom Laravel: nama_prodi, jenjang, id_fakultas)
        const payload = {
            nama_prodi: formData.nama_prodi,
            jenjang: formData.jenjang || null,
            id_fakultas: Number(formData.id_fakultas),
        };

        try {
            const response = await fetch(API_MAJOR_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    const messages = Object.values(errorData.errors)
                        .flat()
                        .join('; ');
                    throw new Error(messages);
                }
                throw new Error(
                    errorData.message || 'Gagal menyimpan data Program Studi.',
                );
            }

            // Sukses
            setSuccessMessage(
                `Program Studi "${formData.nama_prodi}" berhasil ditambahkan!`,
            );
            setFormData((prev) => ({
                ...prev,
                nama_prodi: '',
                jenjang: '',
                // id_fakultas tetap pada pilihan terakhir
            }));
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

    const isDataLoaded = faculties.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <title>Tambah Program Studi</title>

            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Tambah Program Studi Baru
                </h1>

                {error && <CustomAlert message={error} type="error" />}
                {successMessage && (
                    <CustomAlert message={successMessage} type="success" />
                )}

                {!isDataLoaded && !error && (
                    <div className="p-4 text-center text-blue-600">
                        Memuat data fakultas...
                    </div>
                )}

                {isDataLoaded && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="id_fakultas"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Fakultas Induk
                            </label>
                            <select
                                name="id_fakultas"
                                id="id_fakultas"
                                value={formData.id_fakultas}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                            >
                                {faculties.map((f) => (
                                    <option
                                        key={f.id_fakultas}
                                        value={f.id_fakultas}
                                    >
                                        {f.nama_fakultas}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="nama_prodi"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama Program Studi
                            </label>
                            <input
                                type="text"
                                name="nama_prodi"
                                id="nama_prodi"
                                value={formData.nama_prodi}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="jenjang"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Jenjang Pendidikan
                            </label>
                            <select
                                name="jenjang"
                                id="jenjang"
                                value={formData.jenjang}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                            >
                                <option value="">
                                    -- Pilih Jenjang (Opsional) --
                                </option>
                                {JENJANG_OPTIONS.map((j) => (
                                    <option key={j} value={j}>
                                        {j}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <a href="majors/index">
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
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Program Studi'}
                            </CustomButton>
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
