import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';

/**
 * Компонент кнопок взаимодействия с постом (лайк и избранное).
 */

type Props = {
    postId: number;
    likesCount: number;
    favoritesCount: number;
    isAuthenticated: boolean;
};

export default function InteractionButtons({
    postId,
    likesCount,
    favoritesCount,
    isAuthenticated,
}: Props) {
    const { t } = useTranslations();
    const { post: submitLike } = useForm();
    const { post: submitFavorite } = useForm();

    const handleInteraction = (type: 'like' | 'favorite') => {
        if (!isAuthenticated) {
            window.location.href = route('login');
            return;
        }

        const form = type === 'like' ? submitLike : submitFavorite;
        form(route('interactions.toggle', { post: postId, type }), {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex items-center gap-4">
            {/* Кнопка лайка */}
            <button
                type="button"
                onClick={() => handleInteraction('like')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all group"
            >
                <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                    {likesCount}
                </span>
            </button>

            {/* Кнопка избранного */}
            <button
                type="button"
                onClick={() => handleInteraction('favorite')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
            >
                <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600">
                    {favoritesCount}
                </span>
            </button>
        </div>
    );
}
