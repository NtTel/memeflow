import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

/**
 * Хук для работы с переводами в React компонентах.
 *
 * Использование:
 * const { t, locale } = useTranslations();
 * <button>{t('app.submit')}</button>
 *
 * Переводы приходят с бэкенда через Inertia props.
 */

type Translations = {
    app: Record<string, string>;
};

export function useTranslations() {
    // Используем базовый PageProps, который уже содержит auth
    const { props } = usePage<PageProps>();

    /**
     * Функция перевода: принимает ключ вида "app.submit"
     * и возвращает перевод из объекта translations.
     */
    const t = (key: string): string => {
        const [group, name] = key.split('.');

        // Безопасно достаём переводы
        const translations = props.translations as Translations | undefined;
        const translation = translations?.[group as keyof Translations]?.[name];

        // Если перевода нет -> возвращаем сам ключ
        return translation ?? key;
    };

    return {
        t,
        locale: props.locale as string,
    };
}
