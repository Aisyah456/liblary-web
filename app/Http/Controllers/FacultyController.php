<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faculties = Faculty::orderBy('id_fakultas', 'asc')->get();

        return Inertia::render('admin/cms/faculties/index', [
            'faculties' => $faculties,
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
        return Inertia::render('admin/cms/faculties/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_fakultas' => 'required|string|max:100',
            'singkatan' => 'nullable|string|max:10',
        ]);

        Faculty::create($validated);

        return redirect()->route('admin.cms.faculties.index')
            ->with('message', 'Fakultas berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Faculty $faculty)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $faculty = Faculty::findOrFail($id);

        return Inertia::render('admin/cms/faculties/Edit', [
            'faculty' => $faculty,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_fakultas' => 'required|string|max:100',
            'singkatan' => 'nullable|string|max:10',
        ]);

        $faculty = Faculty::findOrFail($id);
        $faculty->update($validated);

        return redirect()->route('admin.faculties.index')
            ->with('message', 'Fakultas berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();

        return redirect()->route('admin.faculties.index')
            ->with('message', 'Fakultas berhasil dihapus!');
    }
}
