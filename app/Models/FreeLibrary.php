<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FreeLibrary extends Model
{
    protected $table = 'bebas_pustaka';
    protected $primaryKey = 'id_bp';

    // Pastikan kolom datetime seperti tgl_validasi dikelola dengan benar
    protected $casts = [
        'tgl_pengajuan' => 'datetime',
        'tgl_validasi' => 'datetime',
    ];

    protected $fillable = [
        'id_anggota',
        'tgl_pengajuan',
        'alasan_pengajuan',
        'status_verifikasi',
        'catatan_verifikasi',
        'tgl_validasi',
        'nomor_surat_bp'
    ];

    public function anggota(): BelongsTo
    {
        // Relasi ke Anggota menggunakan FK id_anggota
        return $this->belongsTo(LibMember::class, 'id_anggota', 'id_anggota');
    }
}
