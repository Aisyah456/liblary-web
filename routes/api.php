<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FreeLibraryController;
use App\Http\Controllers\LibMemberController;
use App\Http\Controllers\MajorController;

// Route untuk Anggota (untuk dropdown di frontend)
Route::get('anggota', [LibMemberController::class, 'index']);

// Route CRUD untuk Bebas Pustaka
Route::resource('bebas_pustaka', FreeLibraryController::class);

Route::resource('majors', MajorController::class)->except(['create', 'edit']);
