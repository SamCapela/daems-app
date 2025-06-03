// src/app/clips/ClipsClient.tsx
'use client';

import Link from 'next/link';
import { TwitchClip } from '@/app/types/TwitchClip';

interface ClipWithVideoUrl extends TwitchClip {
    videoUrl: string | null;
}

interface ClipsClientProps {
    clips: ClipWithVideoUrl[];
}

export default function ClipsClient({ clips }: ClipsClientProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
            <header className="w-full max-w-6xl px-4 py-6">
                <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Clips de Daems_
                </h1>
                <p className="text-center text-lg mt-2 text-gray-300">
                    Les meilleurs clips de la semaine, triés par popularité !
                </p>
                <nav className="mt-4 text-center">
                    <Link href="/" className="text-purple-400 hover:underline mx-4">
                        Accueil
                    </Link>
                    <Link href="/clips" className="text-purple-400 hover:underline mx-4">
                        Clips
                    </Link>
                </nav>
            </header>

            <section className="w-full max-w-4xl px-4 my-8">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {clips.length > 0 ? (
                        clips.map((clip) => (
                            <div
                                key={clip.id}
                                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500"
                            >
                                <h3 className="text-lg font-semibold text-white">{clip.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{clip.view_count} vues</p>
                                <div className="mt-2">
                                    <iframe
                                        src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=daems-app.vercel.app&parent=localhost`}
                                        height="200"
                                        width="100%"
                                        allowFullScreen
                                        className="rounded-md"
                                    ></iframe>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">Aucun clip trouvé cette semaine.</p>
                    )}
                </div>
            </section>

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