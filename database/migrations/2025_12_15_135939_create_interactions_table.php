<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Таблица interactions хранит взаимодействия пользователей с постами:
     * - Лайки (like)
     * - Избранное/Сохранённые (favorite)
     * 
     * Один пользователь может поставить один лайк/фаворит на один пост.
     * Для этого создаём уникальный индекс (user_id, post_id, type).
     * 
     * Поля:
     * - user_id: кто взаимодействовал
     * - post_id: с каким постом
     * - type: тип взаимодействия (like или favorite)
     */
    public function up(): void
    {
        Schema::create('interactions', function (Blueprint $table) {
            $table->id();

            // Кто взаимодействовал с постом
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // С каким постом
            $table->foreignId('post_id')->constrained()->onDelete('cascade');

            // Тип взаимодействия: лайк или избранное
            $table->enum('type', ['like', 'favorite']);

            $table->timestamps();

            // Уникальный индекс: один пользователь может поставить только один лайк/фаворит на один пост
            // Например: user_id=1, post_id=5, type=like -> можно только раз
            $table->unique(['user_id', 'post_id', 'type']);
        });
    }

    /**
     * Откатываем: удаляем таблицу interactions.
     */
    public function down(): void
    {
        Schema::dropIfExists('interactions');
    }
};
