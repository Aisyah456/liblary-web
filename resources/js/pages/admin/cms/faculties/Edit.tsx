import React, { useEffect, useState } from 'react';
import { Faculty } from './columns';

// Import komponen dasar dari Index.tsx
interface BreadcrumbItem {
    title: string;
    href: string;
}

// Catatan: Komponen CustomAlert, CustomButton, dan AppLayout DITENTUKAN di Index.tsx
// Di sini saya membuat dummy untuk memastikan kompilasi mandiri.

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
// --- Akhir Dummy Komponen ---

const API_ENDPOINT = '/api/faculties';

// Asumsi 'id' datang dari route parameter, kita simulasikan di sini.
// Dalam Inertia/Laravel nyata, ini akan menjadi prop.
interface EditProps {
    facultyId: number;
    initialFacultyData?: Faculty; // Opsional jika data sudah di-pass dari Controller
}

// Untuk tujuan demonstrasi, kita akan mengambil ID dari URL,
// tetapi di Inertia, ID biasanya dilewatkan sebagai prop.
const getFacultyIdFromPath = (): number | null => {
    const pathSegments = window.location.pathname.split('/');
    // Asumsi URL: /admin/faculties/edit/{id}
    const idIndex = pathSegments.indexOf('edit') + 1;
    const id = pathSegments[idIndex];
    return id && !isNaN(Number(id)) ? Number(id) : null;
};

export default function Edit(props: EditProps) {
    const facultyId = props.facultyId || getFacultyIdFromPath();

    const [formData, setFormData] = useState<
        Omit<Faculty, 'id_fakultas' | 'created_at' | 'updated_at'>
    >({
        nama_fakultas: '',
        singkatan: '',
    });
    const [processing, setProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fakultas', href: '/admin/cms/faculties' },
        { title: 'Edit', href: `/admin/cms/faculties/edit/${facultyId}` },
    ];

    // --- READ Existing Data ---
    useEffect(() => {
        if (!facultyId) {
            setError('ID Fakultas tidak ditemukan.');
            setIsLoading(false);
            return;
        }

        const fetchFaculty = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_ENDPOINT}/${facultyId}`);
                if (!response.ok)
                    throw new Error('Data fakultas tidak ditemukan.');
                const data: Faculty = await response.json();

                // Peta properti Laravel ke state React
                setFormData({
                    nama_fakultas: data.nama_fakultas,
                    singkatan: data.singkatan || '',
                });
            } catch (e) {
                setError(
                    e instanceof Error
                        ? e.message
                        : 'Gagal memuat data fakultas.',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaculty();
    }, [facultyId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --- UPDATE Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccessMessage(null);

        if (!facultyId) {
            setError('ID Fakultas hilang.');
            setProcessing(false);
            return;
        }

        // Data yang akan dikirim (menggunakan nama kolom Laravel: faculty_name, abbreviation)
        const payload = {
            faculty_name: formData.nama_fakultas,
            abbreviation: formData.singkatan || null,
        };

        try {
            const response = await fetch(`${API_ENDPOINT}/${facultyId}`, {
                method: 'PUT', // Menggunakan PUT untuk update
                headers: {
                    'Content-Type': 'application/json',
                },
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
                throw new Error(errorData.message || 'Gagal memperbarui data.');
            }

            // Sukses
            setSuccessMessage(
                `Fakultas "${formData.nama_fakultas}" berhasil diperbarui!`,
            );
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Terjadi kesalahan tidak terduga saat update.',
            );
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <p className="m-4 text-center">Memuat data fakultas...</p>
            </AppLayout>
        );
    }

    if (error && !isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-xl p-6">
                    <CustomAlert message={error} type="error" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <title>Edit Fakultas</title>

            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Edit Fakultas ID: {facultyId}
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
                            Nama Fakultas
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
                            Singkatan (Opsional)
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
                        <a href="/faculties/edit">
                            <CustomButton
                                className="bg-gray-500 hover:bg-gray-600"
                                type="button"
                            >
                                Batal
                            </CustomButton>
                        </a>
                        <CustomButton
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
