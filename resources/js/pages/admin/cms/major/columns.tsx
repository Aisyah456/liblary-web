export interface Faculty {
    id_fakultas: number;
    nama_fakultas: string;
}

/**
 * Interface untuk data Program Studi (Major), sesuai dengan struktur database.
 */
export interface Major {
    id_prodi: number;
    id_fakultas: number;
    nama_prodi: string;
    jenjang: 'D3' | 'D4' | 'S1' | 'S2' | 'S3' | null;
    // Asumsi properti ini datang dari relasi Eager Loading di Laravel
    faculty: Faculty;
}

/**
 * Definisi kolom untuk header tabel Major.
 */
export const majorColumns = [
    { key: 'id_prodi', label: 'ID' },
    { key: 'nama_prodi', label: 'Nama Program Studi' },
    { key: 'jenjang', label: 'Jenjang' },
    { key: 'nama_fakultas', label: 'Fakultas' }, // Akan menggunakan data relasi
];
