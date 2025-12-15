<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class InteractionController extends Controller
{
    /**
     * Переключение лайка/избранного (toggle).
     * 
     * Логика:
     * 1. Проверяем, есть ли уже такое взаимодействие (user + post + type).
     * 2. Если есть -> удаляем (убираем лайк/избранное).
     * 3. Если нет -> создаём (добавляем лайк/избранное).
     */
    public function toggle(Request $request, Post $post, string $type): RedirectResponse
    {
        // Валидируем тип
        if (!in_array($type, ['like', 'favorite'])) {
            abort(400, 'Invalid interaction type');
        }

        // Ищем существующее взаимодействие
        $interaction = Interaction::where([
            'user_id' => $request->user()->id,
            'post_id' => $post->id,
            'type' => $type,
        ])->first();

        if ($interaction) {
            // Если уже есть -> удаляем (toggle off)
            $interaction->delete();
            $message = $type === 'like' ? 'Лайк убран' : 'Убрано из избранного';
        } else {
            // Если нет -> создаём (toggle on)
            Interaction::create([
                'user_id' => $request->user()->id,
                'post_id' => $post->id,
                'type' => $type,
            ]);
            $message = $type === 'like' ? 'Лайк поставлен!' : 'Добавлено в избранное!';
        }

        return back()->with('success', $message);
    }
}
