<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    /**
     * Поля для массового заполнения.
     */
    protected $fillable = [
        'user_id',
        'post_id',
        'body',
    ];

    /**
     * Отношение: комментарий принадлежит одному пользователю (автору).
     * Связь Many-to-One (много комментариев -> один пользователь).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Отношение: комментарий принадлежит одному посту.
     * Связь Many-to-One (много комментариев -> один пост).
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
