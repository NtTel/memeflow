import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Post } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import PostGallery from '@/Components/PostGallery';
import CommentSection from '@/Components/CommentSection';
import InteractionButtons from '@/Components/InteractionButtons';

/**
 * Детальная страница поста.
 *
 * Отображает:
 * - Полную информацию о посте
 * - Галерею всех медиа-файлов
 * - Кнопки взаимодействия (лайк, избранное)
 * - Секцию комментариев
 */

type Props = PageProps<{
    post: Post;
}>;

export default function Show({ auth, post }: Props) {
    const { t } = useTranslations();

    // Выбираем layout в зависимости от авторизации
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('posts.index')}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {post.title}
                    </h2>
                </div>
            }
        >
            <Head title={post.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {/* Заголовок и информация об авторе */}
                        <div className="p-6 border-b">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {post.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(post.created_at).toLocaleString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Статус (если черновик) */}
                                {post.status === 'draft' && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                        {t('app.draft')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Галерея медиа */}
                        {post.media && post.media.length > 0 && (
                            <div className="p-6 bg-gray-50">
                                <PostGallery media={post.media} />
                            </div>
                        )}

                        {/* Описание */}
                        {post.description && (
                            <div className="p-6 border-b">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                        )}

                        {/* Взаимодействия */}
                        <div className="p-6 border-b bg-gray-50">
                            <InteractionButtons
                                postId={post.id}
                                likesCount={post.likes_count || 0}
                                favoritesCount={post.favorites_count || 0}
                                isAuthenticated={!!auth.user}
                            />
                        </div>

                        {/* Комментарии */}
                        <div className="p-6">
                            <CommentSection
                                postId={post.id}
                                comments={post.comments || []}
                                auth={auth}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
