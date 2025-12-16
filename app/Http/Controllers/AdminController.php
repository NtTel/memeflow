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
