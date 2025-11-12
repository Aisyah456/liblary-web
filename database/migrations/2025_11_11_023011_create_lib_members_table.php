<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PERBAIKAN 1: Tambahkan pengecekan if not exists untuk mencegah error 1050
        if (!Schema::hasTable('lib_members')) {

            Schema::create('lib_members', function (Blueprint $table) {

                // Kunci Utama
                $table->string('id_anggota', 15)->primary(); // NIM/NIDN/NIP sebagai PK

                // Kunci Asing (FK) ke program_studi
                // Menggunakan foreignId() adalah praktik terbaik Laravel
                $table->foreignId('id_prodi')
                    ->nullable()
                    ->constrained('program_studi') // Nama tabel Program Studi
                    ->onDelete('set null');

                // Kolom Data Anggota
                $table->string('nama_lengkap', 100);
                $table->enum('jenis_anggota', ['Mahasiswa', 'Dosen', 'Staf'])->default('Mahasiswa');
                $table->string('email', 100)->unique();
                $table->string('telp', 20)->nullable();
                $table->boolean('status_aktif')->default(true);

                // Timestamps
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pastikan tabel ada sebelum mencoba menghapus FK (pencegahan error)
        if (Schema::hasTable('lib_members')) {

            // Hapus Kunci Asing sebelum menghapus tabel
            // Pastikan kolom 'id_prodi' ada sebelum mencoba menghapus foreign key
            Schema::table('lib_members', function (Blueprint $table) {
                // Hapus foreign key jika ada
                $table->dropForeign(['id_prodi']);
            });

            // Hapus tabel
            Schema::dropIfExists('lib_members');
        }
    }
};
