import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

/**
 * Страница создания поста (предложение пользователя).
 *
 * Форма включает:
 * - Заголовок
 * - Описание
 * - Загрузку медиа-файлов (изображения, видео, PDF)
 */

export default function Create({ auth }: PageProps) {
    const { t } = useTranslations();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        media: [] as File[],
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('media', files);

        // Создаём превью для изображений
        const urls = files.map((file) => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return '';
        });
        setPreviewUrls(urls);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {t('app.create_post')}
                </h2>
            }
        >
            <Head title={t('app.create_post')} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Заголовок */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t('app.title')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Введите заголовок поста..."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Описание */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t('app.description')}
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    placeholder="Добавьте описание (опционально)..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Загрузка файлов */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('app.upload_media')}
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="media-upload"
                                    />
                                    <label htmlFor="media-upload" className="cursor-pointer">
                                        <svg
                                            className="mx-auto w-12 h-12 text-gray-400 mb-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-600">
                                            Нажмите для выбора файлов или перетащите их сюда
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Изображения, видео, PDF (макс. 20MB, до 10 файлов)
                                        </p>
                                    </label>
                                </div>
                                {errors.media && (
                                    <p className="mt-1 text-sm text-red-600">{errors.media}</p>
                                )}
                            </div>

                            {/* Превью загруженных файлов */}
                            {data.media.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Выбрано файлов: {data.media.length}
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {data.media.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                            >
                                                {previewUrls[index] ? (
                                                    <img
                                                        src={previewUrls[index]}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <p className="text-xs text-gray-500 text-center px-2">
                                                            {file.name}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Кнопки */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    Пост будет отправлен на модерацию
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Отправка...' : t('app.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
