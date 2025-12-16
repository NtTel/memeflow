import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Post, PaginatedData } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import InteractionButtons from '@/Components/InteractionButtons';

/**
 * Главная страница: лента опубликованных постов.
 *
 * Отображает:
 * - Карточки постов с медиа
 * - Информацию об авторе
 * - Счётчики лайков и комментариев
 * - Пагинацию
 */

type Props = PageProps<{
    posts: PaginatedData<Post>;
}>;

export default function Index({ auth, posts }: Props) {
    const { t } = useTranslations();

    // Выбираем layout в зависимости от авторизации
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {t('app.posts')}
                    </h2>
                    {auth.user && (
                        <Link
                            href={route('posts.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {t('app.create_post')}
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={t('app.posts')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {posts.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {/* Медиа превью */}
                                    {post.media.length > 0 && (
                                        <div className="aspect-video bg-gray-100">
                                            {post.media[0].type === 'image' ? (
                                                <img
                                                    src={
                                                        post.media[0].url ||
                                                        `/storage/${post.media[0].file_path}`
                                                    }
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : post.media[0].type === 'video' ? (
                                                <video
                                                    src={
                                                        post.media[0].url ||
                                                        `/storage/${post.media[0].file_path}`
                                                    }
                                                    className="w-full h-full object-cover"
                                                    muted
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-red-50">
                                                    <svg
                                                        className="w-16 h-16 text-red-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Контент */}
                                    <div className="p-5">
                                        <Link
                                            href={route('posts.show', post.id)}
                                            className="block mb-2 hover:text-indigo-600 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {post.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                {post.description}
                                            </p>
                                        )}

                                        {/* Автор и дата */}
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <span className="font-medium">{post.user.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>
                                                {new Date(post.created_at).toLocaleDateString(
                                                    'ru-RU'
                                                )}
                                            </span>
                                        </div>

                                        {/* Взаимодействия */}
                                        <div className="flex items-center justify-between">
                                            <InteractionButtons
                                                postId={post.id}
                                                likesCount={post.likes_count || 0}
                                                favoritesCount={post.favorites_count || 0}
                                                isAuthenticated={!!auth.user}
                                            />
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    {post.comments.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                            <p className="text-gray-600 text-lg">Постов пока нет</p>
                            {auth.user && (
                                <Link
                                    href={route('posts.create')}
                                    className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {t('app.create_post')}
                                </Link>
                            )}
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
        </Layout>
    );
}
