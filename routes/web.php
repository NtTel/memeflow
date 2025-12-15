<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Публичные роуты (доступны всем)
|--------------------------------------------------------------------------
*/

// Главная страница: лента постов
Route::get('/', [PostController::class, 'index'])->name('posts.index');

// Просмотр одного поста
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Переключение языка
Route::post('/locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale');
    if (in_array($locale, ['ru', 'en', 'uk'])) {
        $request->session()->put('locale', $locale);
    }
    return back();
})->name('locale.set');

/*
|--------------------------------------------------------------------------
| Роуты для авторизованных пользователей
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Создание поста (предложение)
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    // Комментарии
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Лайки и избранное
    Route::post('/posts/{post}/interactions/{type}', [InteractionController::class, 'toggle'])
        ->name('interactions.toggle')
        ->where('type', 'like|favorite');

    // Профиль пользователя (из Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Админ-панель (только для is_admin = true)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {

    // Список черновиков на модерацию
    Route::get('/drafts', [AdminController::class, 'drafts'])->name('drafts');

    // Утвердить пост
    Route::post('/posts/{post}/approve', [AdminController::class, 'approve'])->name('posts.approve');

    // Отклонить пост
    Route::delete('/posts/{post}/reject', [AdminController::class, 'reject'])->name('posts.reject');
});

/*
|--------------------------------------------------------------------------
| Роуты аутентификации (из Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
