'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
            {/* Navbar */}
            <header className="w-full bg-gray-900 shadow-md">
                <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Stream de Daems
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md">
                            Accueil
                        </Link>
                        <Link href="/clips" className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg shadow-md">
                            Clips
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Section vidéo */}
            <section className="w-full max-w-4xl px-4 my-8">
                <div className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-purple-500">
                    <iframe
                        src="https://player.twitch.tv/?channel=daems_&parent=daems-app.vercel.app&parent=www.daems-app.vercel.app"
                        height="480"
                        width="100%"
                        allowFullScreen
                        className="aspect-video"
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-6 bg-gray-900 text-center">
                <p className="text-gray-400">
                    Suivez{' '}
                    <a href="https://twitch.tv/daems_" className="text-purple-400 hover:underline">
                        Daems_
                    </a>{' '}
                    sur Twitch pour ne rien manquer !
                </p>
            </footer>
        </div>
    );
}
