import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function GuestLayout({
    children,
    header,
}: PropsWithChildren<{ header?: React.ReactNode }>) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-indigo-600">
                                MemeFlow
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <Link
                                href={route('login')}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Войти
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Регистрация
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
