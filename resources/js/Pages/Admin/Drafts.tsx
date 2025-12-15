import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, Post, PaginatedData } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import PostGallery from '@/Components/PostGallery';

/**
 * Админ-панель: модерация предложенных постов.
 *
 * Функции:
 * - Просмотр всех черновиков
 * - Утверждение поста (публикация)
 * - Отклонение поста (удаление)
 */

type Props = PageProps<{
    posts: PaginatedData<Post>;
}>;

export default function Drafts({ auth, posts }: Props) {
    const { t } = useTranslations();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    🛡️ Модерация постов
                </h2>
            }
        >
            <Head title="Модерация постов" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Статистика */}
                    <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Ожидают модерации</p>
                                <p className="text-3xl font-bold text-indigo-600">{posts.total}</p>
                            </div>
                            <Link
                                href={route('posts.index')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                ← Вернуться к ленте
                            </Link>
                        </div>
                    </div>

                    {/* Список черновиков */}
                    {posts.data.length > 0 ? (
                        <div className="space-y-6">
                            {posts.data.map((post) => (
                                <DraftPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <svg
                                className="mx-auto w-16 h-16 text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-gray-600 text-lg">Все посты проверены! 🎉</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Новые предложения появятся здесь
                            </p>
                        </div>
                    )}

                    {/* Пагинация */}
                    {posts.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex gap-2">
                                {posts.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : link.url
                                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/**
 * Карточка черновика поста с кнопками модерации.
 */
function DraftPostCard({ post }: { post: Post }) {
    const { post: approve, processing: approving } = useForm();
    const { delete: reject, processing: rejecting } = useForm();

    const handleApprove = () => {
        if (confirm('Опубликовать этот пост?')) {
            approve(route('admin.posts.approve', post.id), {
                preserveScroll: true,
            });
        }
    };

    const handleReject = () => {
        if (confirm('Отклонить и удалить этот пост? Это действие нельзя отменить.')) {
            reject(route('admin.posts.reject', post.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>

                        {/* Информация об авторе */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <span className="font-medium">{post.user.name}</span>
                            <span>•</span>
                            <span>
                                {new Date(post.created_at).toLocaleString('ru-RU', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>

                        {/* Описание */}
                        {post.description && (
                            <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>
                        )}
                    </div>

                    {/* Статус */}
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full whitespace-nowrap ml-4">
                        На модерации
                    </span>
                </div>

                {/* Галерея медиа */}
                {post.media && post.media.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Медиа-файлов: {post.media.length}
                        </p>
                        <PostGallery media={post.media} />
                    </div>
                )}

                {/* Кнопки модерации */}
                <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={handleApprove}
                        disabled={approving || rejecting}
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {approving ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Публикация...
                            </span>
                        ) : (
                            '✓ Опубликовать'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleReject}
                        disabled={approving || rejecting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {rejecting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Удаление...
                            </span>
                        ) : (
                            '✕ Отклонить'
                        )}
                    </button>

                    <Link
                        href={route('posts.show', post.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        👁️ Просмотр
                    </Link>
                </div>
            </div>
        </div>
    );
}
