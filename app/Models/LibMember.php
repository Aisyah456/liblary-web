<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LibMember extends Model
{
    protected $primaryKey = 'id_anggota';
    public $incrementing = false; // Karena PK adalah string (NIM/NIP)
    protected $keyType = 'string';

    protected $fillable = ['id_anggota', 'id_prodi', 'nama_lengkap', 'jenis_anggota', 'email', 'status_aktif'];

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(Major::class, 'id_prodi', 'id_prodi');
    }

    public function bebasPustaka(): HasMany
    {
        return $this->hasMany(FreeLibrary::class, 'id_anggota', 'id_anggota');
    }
}
