import React, { useEffect, useState } from 'react';

interface Faculty {
    id_fakultas: number;
    nama_fakultas: string;
    singkatan: string | null;
}

// Dummy type for AppLayout usage
interface BreadcrumbItem {
    title: string;
    href: string;
}

// --- Fungsionalitas Inertia/Ziggy diganti dengan Fetch/State standar ---
// Di aplikasi non-Inertia, ini akan menggunakan 'fetch' API ke endpoint Laravel.
// Karena kita tidak memiliki akses ke Inertia atau Ziggy, kita akan simulasikan.

const API_ENDPOINT = '/api/faculties'; // Asumsi endpoint CRUD Laravel

// --- Komponen Sederhana (Pengganti shadcn/ui) ---

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
];

export default function Index() {
    // --- State Management ---
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [flashMessage, setFlashMessage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Asumsi facultyColumns juga diimpor dan digunakan hanya untuk label header
    const facultyColumns = [
        { key: 'id_fakultas', label: 'ID' },
        { key: 'nama_fakultas', label: 'Nama Fakultas' },
        { key: 'singkatan', label: 'Singkatan' },
    ];

    // --- CRUD Fetch Logic (Menggantikan Inertia) ---

    // READ Logic
    const fetchFaculties = async () => {
        setProcessing(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) throw new Error('Gagal mengambil data fakultas.');
            const data: Faculty[] = await response.json();
            setFaculties(data);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Terjadi kesalahan saat memuat data.',
            );
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        fetchFaculties();
        // Simulasi flash message yang mungkin ada dari halaman sebelumnya
        // setFlashMessage("Data fakultas berhasil diperbarui!");
    }, []);

    // DELETE Logic (Menggantikan useForm().delete)
    const handleDelete = async (id: number, name: string) => {
        if (
            !confirm(
                `Yakin ingin menghapus fakultas "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            )
        ) {
            return;
        }

        setProcessing(true);
        setError(null);
        setFlashMessage(null);

        try {
            // Dalam environment non-Inertia, kita panggil API langsung
            const response = await fetch(`${API_ENDPOINT}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Tambahkan X-CSRF-TOKEN jika diperlukan di backend Laravel Anda
                },
            });

            if (!response.ok) {
                // Tangani respons 4xx atau 5xx
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus data.');
            }

            // Sukses: Muat ulang data
            await fetchFaculties();
            setFlashMessage(`Fakultas "${name}" berhasil dihapus.`);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Terjadi kesalahan saat menghapus data.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        // Mengganti Head dari Inertia dengan tag HTML title biasa
        <AppLayout breadcrumbs={breadcrumbs}>
            <title>Daftar Fakultas</title>

            <div className="m-4 flex items-center justify-between rounded-lg bg-white p-4 shadow">
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Fakultas
                </h1>
                {/* Link diganti dengan tag <a> atau CustomButton yang melakukan navigasi */}
                <a href="/faculties/create">
                    <CustomButton className="bg-blue-600 hover:bg-blue-700">
                        Tambah Fakultas
                    </CustomButton>
                </a>
            </div>

            <div className="m-4">
                {error && <CustomAlert message={error} type="error" />}
                {flashMessage && (
                    <CustomAlert message={flashMessage} type="success" />
                )}
            </div>

            {faculties.length > 0 ? (
                <div className="m-4 overflow-hidden rounded-lg bg-white shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <caption className="p-4 text-center text-gray-500">
                            Daftar Fakultas yang Tersedia
                        </caption>
                        <thead className="bg-gray-100">
                            <tr>
                                {facultyColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {faculties.map((faculty) => (
                                <tr
                                    key={faculty.id_fakultas}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                        {faculty.id_fakultas}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                        {faculty.nama_fakultas}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                        {faculty.singkatan ?? (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className="space-x-2 px-6 py-4 text-center text-sm whitespace-nowrap">
                                        {/* Mengganti Link Inertia */}
                                        <a
                                            href={`/faculties/edit/${faculty.id_fakultas}`}
                                        >
                                            <CustomButton className="bg-slate-600 hover:bg-slate-700">
                                                Edit
                                            </CustomButton>
                                        </a>
                                        <CustomButton
                                            disabled={processing}
                                            onClick={() =>
                                                handleDelete(
                                                    faculty.id_fakultas,
                                                    faculty.nama_fakultas,
                                                )
                                            }
                                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Memproses...'
                                                : 'Hapus'}
                                        </CustomButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="m-4 rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-6 text-yellow-800">
                    <p className="font-medium">Informasi:</p>
                    <p>
                        Belum ada data fakultas yang tersedia. Silakan tambahkan
                        data baru.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
