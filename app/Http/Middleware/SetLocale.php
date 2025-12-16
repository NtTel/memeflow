<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Middleware устанавливает текущий язык приложения на основе сессии пользователя.
     * 
     * Логика:
     * 1. Берём язык из сессии (ключ 'locale').
     * 2. Если язык не установлен -> используем язык по умолчанию из config/app.php.
     * 3. Проверяем, что язык входит в список доступных (ru, en, uk).
     * 4. Устанавливаем язык через app()->setLocale().
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Получаем язык из сессии или дефолтный
        $locale = $request->session()->get('locale', config('app.locale'));

        // ВРЕМЕННЫЙ ДЕБАГ - потом удалить
        \Log::info('Current locale: ' . $locale);
        \Log::info('Session locale: ' . $request->session()->get('locale', 'not set'));

        // Проверяем валидность
        if (in_array($locale, ['ru', 'en', 'uk'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
