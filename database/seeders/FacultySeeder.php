<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('faculties')->insert([
            [
                'nama_fakultas' => 'Fakultas Teknik',
                'singkatan' => 'FT',
            ],
            [
                'nama_fakultas' => 'Fakultas Ekonomi dan Bisnis',
                'singkatan' => 'FEB',
            ],
            [
                'nama_fakultas' => 'Fakultas Ilmu Sosial dan Ilmu Politik',
                'singkatan' => 'FISIP',
            ],
            [
                'nama_fakultas' => 'Fakultas Kesehatan',
                'singkatan' => 'FKES',
            ],
            [
                'nama_fakultas' => 'Fakultas Hukum',
                'singkatan' => 'FH',
            ],
            [
                'nama_fakultas' => 'Fakultas Kedokteran',
                'singkatan' => 'FK',
            ],
            [
                'nama_fakultas' => 'Fakultas Pertanian',
                'singkatan' => 'FAPERTA',
            ],
        ]);
    }
}
