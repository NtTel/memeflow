import { usePage } from '@inertiajs/react';

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

/**
 * Минимальный тип для пропсов, содержащих только locale и translations.
 * Не наследуем от базового PageProps, чтобы не требовать обязательное поле auth.
 */
type TranslationsPageProps = {
    locale: string;
    translations: Translations;
};

export function useTranslations() {
    const { props } = usePage<TranslationsPageProps>();

    /**
     * Функция перевода: принимает ключ вида "app.submit"
     * и возвращает перевод из объекта translations.
     */
    const t = (key: string): string => {
        const [group, name] = key.split('.');

        // Получаем перевод из props.translations
        const translation = props.translations?.[group as keyof Translations]?.[name];

        // Если перевода нет -> возвращаем сам ключ
        return translation ?? key;
    };

    return {
        t,
        locale: props.locale,
    };
}
