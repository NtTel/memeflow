import React from 'react';
import { router, usePage } from '@inertiajs/react';

/**
 * Компонент переключателя языка.
 * Отправляет POST-запрос на /locale для смены языка в сессии.
 */

const LANGUAGES = [
    { code: 'ru', label: 'РУ', flag: '🇷🇺' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'uk', label: 'UA', flag: '🇺🇦' },
];

export default function LanguageSwitcher() {
    const { locale } = usePage<{ locale: string }>().props;

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === locale) return; // Уже выбран этот язык

        router.post(
            '/locale',
            { locale: newLocale },
            {
                preserveScroll: true,
                preserveState: false, // ИСПРАВЛЕНО: обновляем весь state для перерисовки
                // Принудительно перезагружаем страницу для обновления всех переводов
                onSuccess: () => {
                    router.reload({ only: ['locale', 'translations', 'auth'] });
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-2">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={locale === lang.code} // Блокируем кнопку активного языка
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-lg transition-all
            ${
                locale === lang.code
                    ? 'bg-indigo-600 text-white shadow-md cursor-default'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
            }
          `}
                    title={lang.label}
                >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
