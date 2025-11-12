<?php

namespace App\Http\Controllers;

use App\Models\LibMember;
use Illuminate\Http\Request;

class LibMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $libMember = LibMember::select('id_anggota', 'nama_lengkap', 'jenis_anggota')->get();

        return response()->json($libMember);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LibMember $libMember)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LibMember $libMember)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LibMember $libMember)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LibMember $libMember)
    {
        //
    }
}
