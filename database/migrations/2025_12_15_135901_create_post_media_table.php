<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Таблица post_media хранит медиа-файлы, привязанные к постам.
     * Один пост может иметь много файлов (One-to-Many).
     * 
     * Поля:
     * - post_id: к какому посту относится файл
     * - file_path: путь к файлу в storage (например: posts/abc123.jpg)
     * - type: тип файла (image, video, pdf)
     */
    public function up(): void
    {
        Schema::create('post_media', function (Blueprint $table) {
            $table->id();

            // Внешний ключ на таблицу posts
            // Если пост удаляется -> все его медиа тоже удаляются (cascade)
            $table->foreignId('post_id')->constrained()->onDelete('cascade');

            // Путь к файлу в storage/app/public/
            $table->string('file_path');

            // Тип медиа: картинка, видео или PDF
            $table->enum('type', ['image', 'video', 'pdf']);

            $table->timestamps();
        });
    }

    /**
     * Откатываем: удаляем таблицу post_media.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_media');
    }
};
