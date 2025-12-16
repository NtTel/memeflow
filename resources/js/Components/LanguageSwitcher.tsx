import { usePage, router } from '@inertiajs/react';

/**
 * Компонент переключателя языка.
 * Использует Inertia router.post для смены языка без полной перезагрузки.
 */

const LANGUAGES = [
    { code: 'ru', label: 'РУ', flag: '🇷🇺' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'uk', label: 'UA', flag: '🇺🇦' },
];

export default function LanguageSwitcher() {
    const page = usePage();
    const locale = page.props.locale as string;

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === locale) return;

        // Используем router.post с полным обновлением страницы
        router.post(
            '/locale',
            { locale: newLocale },
            {
                preserveScroll: true,
                preserveState: false, // Полностью обновляем state
                // Убрали window.location.reload() - Inertia сам обновит пропсы
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
                    disabled={locale === lang.code}
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-lg transition-all
            ${
                locale === lang.code
                    ? 'bg-indigo-600 text-white shadow-md cursor-default'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
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
