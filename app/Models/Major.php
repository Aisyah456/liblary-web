<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Major extends Model
{
    use HasFactory;

    // Tentukan nama tabel
    protected $table = 'majors';

    // Tentukan primary key
    protected $primaryKey = 'id_prodi';

    // Tentukan kolom yang dapat diisi
    protected $fillable = [
        'id_fakultas',
        'nama_prodi',
        'jenjang',
    ];

    /**
     * Relasi ke Fakultas.
     */
    public function faculty(): BelongsTo
    {
        // Pastikan foreign key lokal (id_fakultas) dan primary key target (id_fakultas) sesuai.
        return $this->belongsTo(Faculty::class, 'id_fakultas', 'id_fakultas');
    }
}
