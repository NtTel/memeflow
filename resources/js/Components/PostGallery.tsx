import React, { useState } from 'react';

/**
 * Компонент галереи медиа-файлов поста.
 *
 * Отображает:
 * - Изображения (с возможностью просмотра)
 * - Видео (с плеером)
 * - PDF (ссылка на скачивание)
 */

type MediaItem = {
    id: number;
    file_path: string;
    type: 'image' | 'video' | 'pdf';
    url?: string; // добавим accessor из модели
};

type Props = {
    media: MediaItem[];
};

export default function PostGallery({ media }: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!media || media.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => {
                    // Формируем URL файла
                    const fileUrl = item.url || `/storage/${item.file_path}`;

                    // Изображение
                    if (item.type === 'image') {
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedImage(fileUrl)}
                                className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition-all cursor-pointer group"
                            >
                                <img
                                    src={fileUrl}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
                                </div>
                            </button>
                        );
                    }

                    // Видео
                    if (item.type === 'video') {
                        return (
                            <div
                                key={item.id}
                                className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200"
                            >
                                <video
                                    controls
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                >
                                    <source src={fileUrl} />
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </div>
                        );
                    }

                    // PDF
                    if (item.type === 'pdf') {
                        return (
                            <a
                                key={item.id}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-red-400 transition-all bg-red-50 flex flex-col items-center justify-center p-4 text-center group"
                            >
                                <svg
                                    className="w-12 h-12 text-red-500 mb-2 group-hover:scale-110 transition-transform"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-red-600">
                                    PDF документ
                                </span>
                            </a>
                        );
                    }

                    return null;
                })}
            </div>

            {/* Модальное окно для просмотра изображения */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt=""
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
