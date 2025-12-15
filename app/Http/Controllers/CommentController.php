<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    /**
     * Добавление комментария к посту.
     * 
     * Логика:
     * 1. Валидируем текст комментария.
     * 2. Создаём комментарий, привязанный к посту и пользователю.
     * 3. Возвращаем пользователя на ту же страницу (Inertia автоматически обновит данные).
     */
    public function store(Request $request, Post $post): RedirectResponse
    {
        // Валидация
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        // Создаём комментарий
        Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $post->id,
            'body' => $validated['body'],
        ]);

        return back()->with('success', 'Комментарий добавлен!');
    }
}
