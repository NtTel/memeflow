<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    use HasFactory;

    /**
     * Поля для массового заполнения.
     */
    protected $fillable = [
        'user_id',
        'post_id',
        'type',
    ];

    /**
     * Отношение: взаимодействие принадлежит одному пользователю.
     * Связь Many-to-One (много взаимодействий -> один пользователь).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Отношение: взаимодействие принадлежит одному посту.
     * Связь Many-to-One (много взаимодействий -> один пост).
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
