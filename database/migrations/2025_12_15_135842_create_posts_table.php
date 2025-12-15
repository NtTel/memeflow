<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Таблица posts хранит публикации и предложения пользователей.
     * 
     * Поля:
     * - user_id: кто создал пост (связь One-to-Many с users)
     * - status: статус поста (draft = черновик, published = опубликован)
     * - title: заголовок поста
     * - description: описание/текст поста
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Внешний ключ на таблицу users
            // Если пользователь удаляется -> все его посты тоже удаляются (cascade)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Статус поста: draft (предложение) или published (в ленте)
            $table->enum('status', ['draft', 'published'])->default('draft');

            // Контент поста
            $table->string('title'); // заголовок (обязательное поле)
            $table->text('description')->nullable(); // описание (опционально)

            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Откатываем: удаляем таблицу posts.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
