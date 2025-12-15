<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    /**
     * Поля, которые можно массово заполнять (mass assignment).
     */
    protected $fillable = [
        'user_id',
        'status',
        'title',
        'description',
    ];

    /**
     * Отношение: пост принадлежит одному пользователю (автору).
     * Связь Many-to-One (много постов -> один пользователь).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Отношение: у поста может быть много медиа-файлов.
     * Связь One-to-Many (один пост -> много медиа).
     */
    public function media(): HasMany
    {
        return $this->hasMany(PostMedia::class);
    }

    /**
     * Отношение: у поста может быть много комментариев.
     * Связь One-to-Many (один пост -> много комментариев).
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Отношение: у поста может быть много взаимодействий (лайки, избранное).
     * Связь One-to-Many (один пост -> много взаимодействий).
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }

    /**
     * Scope: только опубликованные посты.
     * Использование: Post::published()->get()
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope: только черновики.
     * Использование: Post::draft()->get()
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}
