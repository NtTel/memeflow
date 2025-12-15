import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

/**
 * Компонент переключателя языка.
 *
 * Отображает кнопки RU/EN/UA для смены языка интерфейса.
 * При клике отправляет POST-запрос на /locale с выбранным языком.
 */

const LANGUAGES = [
    { code: 'ru', label: 'РУ', flag: '🇷🇺' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'uk', label: 'UA', flag: '🇺🇦' },
];

export default function LanguageSwitcher() {
    const { locale } = useTranslations();
    const { post } = useForm();

    const handleLanguageChange = (newLocale: string) => {
        post(route('locale.set'), {
            data: { locale: newLocale },
            preserveScroll: true, // не скроллим страницу после смены языка
        });
    };

    return (
        <div className="flex items-center gap-2">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-lg transition-all
            ${
                locale === lang.code
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
