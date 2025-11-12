export interface Faculty {
    id_fakultas: number;
    nama_fakultas: string;
    singkatan: string | null; // Bisa null
    created_at?: string;
    updated_at?: string;
}

/**
 * Definisi kolom untuk header tabel.
 */
export const facultyColumns = [
    { key: 'id_fakultas', label: 'ID' },
    { key: 'nama_fakultas', label: 'Nama Fakultas' },
    { key: 'singkatan', label: 'Singkatan' },
];
