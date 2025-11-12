<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculties';
    protected $primaryKey = 'id_fakultas';
    public $timestamps = false; // karena tidak ada created_at / updated_at

    protected $fillable = [
        'nama_fakultas',
        'singkatan',
    ];

    public function programStudi(): HasMany
    {
        return $this->hasMany(Major::class, 'id_fakultas', 'id_fakultas');
    }
}
