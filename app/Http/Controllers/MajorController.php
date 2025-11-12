<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Diperlukan untuk validasi unik saat update
use Inertia\Inertia;

class MajorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Menggunakan paginate() lebih baik daripada get() untuk data besar
        $faculties = Faculty::orderBy('id_fakultas', 'asc')->get();

        return Inertia::render('admin/cms/major/index', [
            'faculties' => $faculties,
            // Flash message sudah benar
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/cms/major/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Tambahkan aturan unique agar nama fakultas tidak ganda
            'nama_fakultas' => 'required|string|max:100|unique:faculties,nama_fakultas',
            'singkatan' => 'nullable|string|max:10|unique:faculties,singkatan', // Singkatan juga unik
        ]);

        Faculty::create($validated);

        // Pastikan nama route (admin.cms.faculties.index) sudah benar
        return redirect()->route('admin.cms.faculties.index')
            ->with('message', 'Fakultas berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Faculty $faculty)
    {
        // Umumnya tidak digunakan untuk resource sederhana, tetapi bisa dikembalikan jika diperlukan
        return Inertia::render('admin/cms/major/Show', [
            'faculty' => $faculty,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    // PERBAIKAN: Menggunakan Route Model Binding
    public function edit(Faculty $faculty)
    {
        // $faculty sudah otomatis terisi berdasarkan ID di URL
        return Inertia::render('admin/cms/major/Edit', [
            'faculty' => $faculty,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // PERBAIKAN: Menggunakan Route Model Binding dan Rule::unique
    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            // Update Unique: Abaikan ID Fakultas saat ini
            'nama_fakultas' => [
                'required',
                'string',
                'max:100',
                Rule::unique('faculties', 'nama_fakultas')->ignore($faculty->id_fakultas, 'id_fakultas'),
            ],
            'singkatan' => [
                'nullable',
                'string',
                'max:10',
                Rule::unique('faculties', 'singkatan')->ignore($faculty->id_fakultas, 'id_fakultas'),
            ],
        ]);

        $faculty->update($validated);

        // Pastikan nama route sudah benar
        return redirect()->route('admin.cms.major.index')
            ->with('message', 'Fakultas berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    // PERBAIKAN: Menggunakan Route Model Binding
    public function destroy(Faculty $faculty)
    {
        // Peringatan: Karena tabel Program Studi ('majors') memiliki FK ke Fakultas,
        // jika onDelete('cascade') tidak diaktifkan, penghapusan ini akan gagal 
        // jika ada Program Studi yang terkait.
        $faculty->delete();

        // Pastikan nama route sudah benar
        return redirect()->route('admin.cms.major.index')
            ->with('message', 'Fakultas berhasil dihapus!');
    }
}
