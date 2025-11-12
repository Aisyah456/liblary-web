<?php

namespace App\Http\Controllers;

use App\Models\FreeLibrary;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FreeLibraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $freeLibrary = FreeLibrary::with([
            'anggota:id_anggota,nama_lengkap,jenis_anggota,id_prodi',
            'anggota.programStudi:id_prodi,nama_prodi,id_fakultas',
            'anggota.programStudi.fakultas:id_fakultas,singkatan'
        ])->get();

        return response()->json($freeLibrary);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_anggota' => 'required|string|exists:anggota,id_anggota',
            'alasan_pengajuan' => 'required|string|max:50',
            // status_verifikasi diisi default 'Diajukan' pada migrasi
        ]);

        // Tambahkan tgl_pengajuan otomatis saat create
        $freeLibrary = FreeLibrary::create([
            ...$validated,
            'tgl_pengajuan' => now(),
            'status_verifikasi' => 'Diajukan', // Pastikan status awal benar
        ]);

        return response()->json($freeLibrary, 201); // 201 Created
    }
    /**
     * Display the specified resource.
     */
    public function show(FreeLibrary $freeLibrary)
    {
        $freeLibrary->load([
            'anggota:id_anggota,nama_lengkap,jenis_anggota,id_prodi',
            'anggota.programStudi:id_prodi,nama_prodi,id_fakultas',
            'anggota.programStudi.fakultas:id_fakultas,singkatan'
        ]);

        return response()->json($freeLibrary);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FreeLibrary $freeLibrary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FreeLibrary $freeLibrary)
    {
        $validated = $request->validate([
            'alasan_pengajuan' => 'sometimes|required|string|max:50',
            'status_verifikasi' => ['sometimes', 'required', Rule::in(['Diajukan', 'Tertunda', 'Lolos'])],
            'catatan_verifikasi' => 'nullable|string',
            'tgl_validasi' => 'nullable|date',
            'nomor_surat_bp' => 'nullable|string|max:50',
        ]);

        // Atur tgl_validasi otomatis jika status diubah menjadi 'Lolos'
        if ($request->has('status_verifikasi') && $request->status_verifikasi === 'Lolos' && empty($bebasPustaka->tgl_validasi)) {
            $validated['tgl_validasi'] = now();
        }

        $freeLibrary->update($validated);

        return response()->json($freeLibrary);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FreeLibrary $freeLibrary)
    {
        $freeLibrary->delete();

        return response()->json(null, 204); // 204 No Content
    }
}
