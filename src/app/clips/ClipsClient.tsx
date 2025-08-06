'use client';

import { useState, useEffect } from 'react';
import { TwitchClip } from '@/app/types/TwitchClip';

interface ClipsClientProps {
    clips: TwitchClip[];
    title: string;
    currentPage: number;
    hasMore: boolean;
    onPageChange: (page: number) => void;
}

export default function ClipsClient({
    clips,
    title,
    currentPage,
    hasMore,
    onPageChange,
}: ClipsClientProps) {
    const [selectedClip, setSelectedClip] = useState<TwitchClip | null>(null);
    const [animationTrigger, setAnimationTrigger] = useState(false);

    useEffect(() => {
        // Re-trigger animation à chaque changement de clips
        setAnimationTrigger(false);
        const timeout = setTimeout(() => setAnimationTrigger(true), 50); // petit délai
        return () => clearTimeout(timeout);
    }, [clips]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedClip(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4 gap-6 mb-6">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
                >
                    Précédent
                </button>
                <span className="text-gray-300">Page {currentPage}</span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>

            {/* Grille des clips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {clips.slice(0, 15).map((clip, index) => (
                    <div
                        key={clip.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform duration-300
                            ${animationTrigger ? 'clip-visible' : 'clip-hidden'}`}
                        style={{ animationDelay: `${index * 222}ms` }}
                        onClick={() => setSelectedClip(clip)}
                    >
                        <img
                            src={clip.thumbnail_url.replace('-preview-480x272.jpg', '-preview-854x480.jpg')}
                            alt={clip.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <h4 className="text-white font-bold text-lg truncate">{clip.title}</h4>
                            <span className="text-gray-200 text-sm">{clip.view_count} vues</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overlay plein écran */}
            {selectedClip && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="relative w-full max-w-4xl p-4">
                        <button
                            onClick={() => setSelectedClip(null)}
                            className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300"
                        >
                            &times;
                        </button>
                        <iframe
                            src={`https://clips.twitch.tv/embed?clip=${selectedClip.id}&parent=${window.location.hostname}&autoplay=true&muted=false`}
                            height="500"
                            width="100%"
                            allowFullScreen
                            className="rounded-lg shadow-lg"
                        ></iframe>
                    </div>
                </div>
            )}

            <style jsx>{`
                .clip-hidden {
                    opacity: 0;
                    transform: translateY(10px);
                }
                .clip-visible {
                    animation: clipFadeIn 0.4s forwards;
                }
                @keyframes clipFadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}