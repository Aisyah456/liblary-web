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
        Schema::create('free_libraries', function (Blueprint $table) {
            $table->id('id_bp');
            $table->string('id_anggota', 15);
            $table->foreign('id_anggota')
                ->references('id_anggota')
                ->on('anggotas')
                ->onDelete('cascade');

            // Kolom Data Transaksi Bebas Pustaka
            $table->dateTime('tgl_pengajuan');
            $table->string('alasan_pengajuan', 50);
            $table->enum('status_verifikasi', ['Diajukan', 'Tertunda', 'Lolos'])->default('Diajukan');
            $table->text('catatan_verifikasi')->nullable();
            $table->dateTime('tgl_validasi')->nullable();
            $table->string('nomor_surat_bp', 50)->nullable();

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('free_libraries', function (Blueprint $table) {
            $table->dropForeign(['id_anggota']);
        });
        Schema::dropIfExists('free_libraries');
    }
};
