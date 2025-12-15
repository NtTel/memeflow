import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslations';
import { PageProps } from '@/types';

/**
 * Компонент секции комментариев.
 *
 * Функции:
 * - Отображение списка комментариев
 * - Форма добавления нового комментария (только для авторизованных)
 */

type User = {
    id: number;
    name: string;
};

type Comment = {
    id: number;
    body: string;
    created_at: string;
    user: User;
};

type Props = {
    postId: number;
    comments: Comment[];
    auth: PageProps['auth'];
};

export default function CommentSection({ postId, comments, auth }: Props) {
    const { t } = useTranslations();
    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('comments.store', postId), {
            onSuccess: () => {
                reset('body');
            },
        });
    };

    return (
        <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">{t('app.comments')}</h3>

            {/* Форма добавления комментария */}
            {auth.user ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="mb-3">
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder={t('app.write_comment')}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing || !data.body.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {t('app.add_comment')}
                    </button>
                </form>
            ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">
                        Чтобы оставить комментарий, пожалуйста,{' '}
                        <a
                            href={route('login')}
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            войдите в систему
                        </a>
                        .
                    </p>
                </div>
            )}

            {/* Список комментариев */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-900">
                                    {comment.user?.name || 'Пользователь'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.created_at).toLocaleString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.body}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">{t('app.no_comments')}</p>
                )}
            </div>
        </div>
    );
}
