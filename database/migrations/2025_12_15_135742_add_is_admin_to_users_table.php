<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Добавляем поле is_admin к таблице users.
     * Это булево поле определяет, является ли пользователь администратором.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Добавляем булево поле is_admin со значением по умолчанию false
            // Поле будет добавлено после поля password
            $table->boolean('is_admin')->default(false)->after('password');
        });
    }

    /**
     * Откатываем изменения: удаляем поле is_admin.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
