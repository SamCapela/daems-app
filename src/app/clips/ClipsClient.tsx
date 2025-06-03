// src/app/clips/ClipsClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TwitchClip } from '@/app/types/TwitchClip';

interface ClipsClientProps {
    clips: TwitchClip[];
    isProduction: boolean;
}

export default function ClipsClient({ clips, isProduction }: ClipsClientProps) {
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const parentDomains = isProduction
        ? ['daems-app.vercel.app', 'www.daems-app.vercel.app']
        : ['local.daems-app.com'];

    const parentQuery = parentDomains.map((domain) => `parent=${domain}`).join('&');

    const handlePrevious = () => {
        setCurrentClipIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : clips.length - 1
        );
    };

    const handleNext = () => {
        setCurrentClipIndex((prevIndex) =>
            prevIndex < clips.length - 1 ? prevIndex + 1 : 0
        );
    };

    const currentClip = clips[currentClipIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
            <header className="w-full max-w-6xl px-4 py-6">
                <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Clips de Daems_
                </h1>
                <p className="text-center text-lg mt-2 text-gray-300">
                    Les meilleurs clips du dernier mois, triés par popularité !
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

            <section className="w-full max-w-4xl px-4 my-8 flex flex-col items-center">
                {clips.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-white mb-2">{currentClip.title}</h3>
                        <p className="text-gray-400 text-sm mb-1">{currentClip.view_count} vues</p>
                        <p className="text-gray-400 text-sm mb-4">
                            {new Date(currentClip.created_at).toLocaleDateString()}
                        </p>

                        <div className="relative w-full max-w-[640px] h-[360px] mb-4">
                            <iframe
                                src={`https://clips.twitch.tv/embed?clip=${currentClip.id}&${parentQuery}`}
                                height="360"
                                width="640"
                                allowFullScreen
                                className="rounded-md"
                            ></iframe>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handlePrevious}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                                aria-label="Clip précédent"
                            >
                                ←
                            </button>
                            <span className="text-gray-400">
                                Clip {currentClipIndex + 1} sur {clips.length}
                            </span>
                            <button
                                onClick={handleNext}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                                aria-label="Clip suivant"
                            >
                                →
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun clip trouvé pour le dernier mois.</p>
                )}
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