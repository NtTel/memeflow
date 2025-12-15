<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Роут для смены языка
Route::post('/locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale');

    // Проверяем, что выбранный язык валидный
    if (in_array($locale, ['ru', 'en', 'uk'])) {
        // Сохраняем выбор в сессию
        $request->session()->put('locale', $locale);
    }

    // Возвращаем пользователя обратно на предыдущую страницу
    return back();
})->name('locale.set');


require __DIR__ . '/auth.php';
