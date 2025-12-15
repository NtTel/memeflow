<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMedia extends Model
{
    use HasFactory;

    /**
     * Поля для массового заполнения.
     */
    protected $fillable = [
        'post_id',
        'file_path',
        'type',
    ];

    /**
     * Отношение: медиа-файл принадлежит одному посту.
     * Связь Many-to-One (много медиа -> один пост).
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Accessor: получаем полный URL файла для frontend.
     * Использование: $media->url
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
