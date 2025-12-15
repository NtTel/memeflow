<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Таблица comments хранит комментарии пользователей к постам.
     * Один пост может иметь много комментариев (One-to-Many).
     * Один пользователь может оставить много комментариев (One-to-Many).
     * 
     * Поля:
     * - user_id: кто написал комментарий
     * - post_id: к какому посту относится комментарий
     * - body: текст комментария
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Кто написал комментарий
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // К какому посту относится
            $table->foreignId('post_id')->constrained()->onDelete('cascade');

            // Текст комментария
            $table->text('body');

            $table->timestamps();
        });
    }

    /**
     * Откатываем: удаляем таблицу comments.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
