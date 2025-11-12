<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/faculties', [App\Http\Controllers\FacultyController::class, 'index'])->name('faculties.index');
    Route::get('/faculties/create', [App\Http\Controllers\FacultyController::class, 'create'])->name('faculties.create');
    Route::get('/faculties/edit/{faculty}', [App\Http\Controllers\FacultyController::class, 'edit'])->name('faculties.edit');

    Route::get('/majors', [App\Http\Controllers\MajorController::class, 'index'])->name('majors.index');
    Route::get('/majors/create', [App\Http\Controllers\MajorController::class, 'create'])->name('majors.create');
    Route::get('/majors/edit/{major}', [App\Http\Controllers\MajorController::class, 'edit'])->name('majors.edit');
});

require __DIR__ . '/settings.php';
