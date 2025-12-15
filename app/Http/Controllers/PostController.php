<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostMedia;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PostController extends Controller
{
    /**
     * Главная страница: лента опубликованных постов.
     * 
     * Загружаем:
     * - Автора поста (user)
     * - Медиа-файлы (media)
     * - Комментарии с авторами (comments.user)
     * - Подсчитываем лайки и избранное
     */
    public function index(): Response
    {
        $posts = Post::with([
            'user',
            'media',
            'comments.user',
        ])
            ->withCount([
                'interactions as likes_count' => fn($query) => $query->where('type', 'like'),
                'interactions as favorites_count' => fn($query) => $query->where('type', 'favorite'),
            ])
            ->published() // только опубликованные
            ->latest() // сортировка по дате (новые сверху)
            ->paginate(12);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Форма создания поста (предложение от пользователя).
     */
    public function create(): Response
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Сохранение предложенного поста (статус = draft).
     * 
     * Логика:
     * 1. Валидируем данные (заголовок, описание, файлы).
     * 2. Создаём пост со статусом draft.
     * 3. Загружаем медиа-файлы в storage/app/public/posts/.
     * 4. Определяем тип файла (image/video/pdf) по mime-type.
     * 5. Сохраняем записи в таблицу post_media.
     */
    public function store(Request $request): RedirectResponse
    {
        // Валидация
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'media' => ['nullable', 'array', 'max:10'], // максимум 10 файлов
            'media.*' => ['file', 'mimes:jpg,jpeg,png,gif,mp4,mov,avi,pdf', 'max:20480'], // макс 20MB
        ]);

        // Создаём пост как черновик
        $post = Post::create([
            'user_id' => $request->user()->id,
            'status' => 'draft', // всегда сначала на модерацию
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Обрабатываем медиа-файлы
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                // Сохраняем файл в storage/app/public/posts/
                $path = $file->store('posts', 'public');

                // Определяем тип файла
                $mime = $file->getMimeType();
                $type = 'image'; // по умолчанию

                if (str_contains($mime, 'video')) {
                    $type = 'video';
                } elseif (str_contains($mime, 'pdf')) {
                    $type = 'pdf';
                }

                // Создаём запись в post_media
                PostMedia::create([
                    'post_id' => $post->id,
                    'file_path' => $path,
                    'type' => $type,
                ]);
            }
        }

        return redirect()->route('posts.index')
            ->with('success', 'Пост отправлен на модерацию!');
    }

    /**
     * Просмотр одного поста (детальная страница).
     */
    public function show(Post $post): Response
    {
        // Загружаем связанные данные
        $post->load([
            'user',
            'media',
            'comments.user',
        ]);

        // Считаем лайки и избранное
        $post->loadCount([
            'interactions as likes_count' => fn($query) => $query->where('type', 'like'),
            'interactions as favorites_count' => fn($query) => $query->where('type', 'favorite'),
        ]);

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }
}
