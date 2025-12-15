<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminController extends Controller
{
    /**
     * Конструктор: защищаем все методы админки.
     * Только пользователи с is_admin = true могут сюда попасть.
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user() || !$request->user()->is_admin) {
                abort(403, 'Доступ запрещён. Требуются права администратора.');
            }
            return $next($request);
        });
    }

    /**
     * Страница модерации: список черновиков (предложений пользователей).
     */
    public function drafts(): Response
    {
        $posts = Post::with(['user', 'media'])
            ->draft() // только черновики
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Drafts', [
            'posts' => $posts,
        ]);
    }

    /**
     * Утверждение поста (публикация).
     * 
     * Логика:
     * 1. Меняем статус с draft на published.
     * 2. Пост появляется в общей ленте.
     */
    public function approve(Post $post): RedirectResponse
    {
        $post->update([
            'status' => 'published',
        ]);

        return back()->with('success', 'Пост опубликован!');
    }

    /**
     * Отклонение поста (удаление черновика).
     */
    public function reject(Post $post): RedirectResponse
    {
        $post->delete(); // удаляем пост (медиа удалится автоматически через cascade)

        return back()->with('success', 'Пост отклонён и удалён.');
    }
}
