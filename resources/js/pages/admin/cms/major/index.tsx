import React, { useEffect, useState } from 'react';

// --- Definisi Tipe dan Kolom (Dipindahkan dari './columns') ---
// Interface untuk data Fakultas
interface Faculty {
    nama_fakultas: string;
}

// Interface untuk data Program Studi (Major)
interface Major {
    id_prodi: number;
    nama_prodi: string;
    jenjang: string | null; // Jenjang Pendidikan, misal S1, D3
    faculty: Faculty | null; // Relasi ke data fakultas
}

// Interface untuk definisi Kolom
interface ColumnDefinition {
    key: keyof Major | 'faculty_name_display';
    label: string;
}

// Definisi Kolom yang digunakan untuk header tabel
const majorColumns: ColumnDefinition[] = [
    { key: 'id_prodi', label: 'ID Prodi' },
    { key: 'nama_prodi', label: 'Nama Program Studi' },
    { key: 'jenjang', label: 'Jenjang' },
    // Key ini digunakan hanya untuk rendering header, data diambil dari 'major.faculty.nama_fakultas'
    { key: 'faculty_name_display', label: 'Fakultas' },
];
// --- Akhir Definisi Tipe dan Kolom ---

// --- Komponen Dasar (Diambil dari implementasi sebelumnya) ---
interface BreadcrumbItem {
    title: string;
    href: string;
}

// Komponen Alert Kustom
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

// Komponen Tombol Kustom
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

// Komponen Tata Letak Aplikasi
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

const API_ENDPOINT = '/api/majors';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Program Studi',
        href: '/majors/index',
    },
];

export default function Index() {
    const [majors, setMajors] = useState<Major[]>([]);
    const [flashMessage, setFlashMessage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Custom Modal State (untuk mengganti confirm())
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [majorToDelete, setMajorToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // READ Logic
    const fetchMajors = async () => {
        setProcessing(true);
        setError(null);
        try {
            // Kita asumsikan API endpoint mengambil relasi 'faculty'
            const response = await fetch(API_ENDPOINT);
            if (!response.ok)
                throw new Error('Gagal mengambil data Program Studi.');
            // Menggunakan Major[] sebagai tipe data yang diharapkan dari API
            const data: Major[] = await response.json();
            setMajors(data);
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
        fetchMajors();
    }, []);

    // DELETE Logic (Tanpa konfirmasi browser, menggunakan state modal)
    const handleConfirmDelete = (id: number, name: string) => {
        setMajorToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        if (!majorToDelete) return;

        const { id, name } = majorToDelete;
        setShowDeleteModal(false);
        setProcessing(true);
        setError(null);
        setFlashMessage(null);
        setMajorToDelete(null);

        try {
            const response = await fetch(`${API_ENDPOINT}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus data.');
            }

            await fetchMajors();
            setFlashMessage(`Program Studi "${name}" berhasil dihapus.`);
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

    // Komponen Modal Kustom untuk Konfirmasi
    const DeleteConfirmationModal: React.FC = () => {
        if (!showDeleteModal || !majorToDelete) return null;

        return (
            <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-600 transition-opacity">
                <div className="mx-4 w-full max-w-sm transform rounded-lg bg-white p-6 shadow-xl transition-all">
                    <h3 className="mb-4 text-lg font-bold text-red-600">
                        Konfirmasi Penghapusan
                    </h3>
                    <p className="mb-6 text-gray-700">
                        Yakin ingin menghapus Program Studi:{' '}
                        <span className="font-semibold">
                            {majorToDelete.name}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <CustomButton
                            className="bg-gray-400 hover:bg-gray-500"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Batal
                        </CustomButton>
                        <CustomButton
                            className="bg-red-600 hover:bg-red-700"
                            onClick={executeDelete}
                        >
                            Ya, Hapus
                        </CustomButton>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <title>Daftar Program Studi</title>

            <DeleteConfirmationModal />

            <div className="m-4 flex items-center justify-between rounded-lg bg-white p-4 shadow">
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Program Studi
                </h1>
                <a href="/majors/create">
                    <CustomButton className="bg-blue-600 hover:bg-blue-700">
                        Tambah Program Studi
                    </CustomButton>
                </a>
            </div>

            <div className="m-4">
                {error && <CustomAlert message={error} type="error" />}
                {flashMessage && (
                    <CustomAlert message={flashMessage} type="success" />
                )}
            </div>

            {processing && (
                <div className="m-4 p-4 text-center font-medium text-blue-600">
                    Memuat data, harap tunggu...
                </div>
            )}

            {!processing && majors.length > 0 ? (
                <div className="m-4 overflow-hidden rounded-lg bg-white shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <caption className="p-4 text-center text-gray-500">
                            Daftar Program Studi yang Tersedia
                        </caption>
                        <thead className="bg-gray-100">
                            <tr>
                                {majorColumns.map((col) => (
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
                            {majors.map((major) => (
                                <tr
                                    key={major.id_prodi}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                        {major.id_prodi}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                        {major.nama_prodi}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                        {major.jenjang ?? (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                                        {major.faculty?.nama_fakultas ||
                                            'Tidak Ditemukan'}
                                    </td>
                                    <td className="space-x-2 px-6 py-4 text-center text-sm whitespace-nowrap">
                                        <a
                                            href={`/admin/majors/edit/${major.id_prodi}`}
                                        >
                                            <CustomButton className="bg-slate-600 hover:bg-slate-700">
                                                Edit
                                            </CustomButton>
                                        </a>
                                        <CustomButton
                                            disabled={processing}
                                            onClick={() =>
                                                handleConfirmDelete(
                                                    major.id_prodi,
                                                    major.nama_prodi,
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
                !processing &&
                majors.length === 0 && (
                    <div className="m-4 rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-6 text-yellow-800">
                        <p className="font-medium">Informasi:</p>
                        <p>
                            Belum ada data Program Studi yang tersedia. Silakan
                            tambahkan data baru.
                        </p>
                    </div>
                )
            )}
        </AppLayout>
    );
}
