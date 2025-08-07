'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TwitchClip } from '@/app/types/TwitchClip';
import ClipsClient from './ClipsClient';

export default function Clips() {
    const [category, setCategory] = useState<'week' | 'month' | 'global'>('week');
    const [sortType, setSortType] = useState<'views' | 'recent' | 'old'>('views');
    const [clips, setClips] = useState<TwitchClip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
        fetchClips(1);
    }, [category, sortType]);

    const fetchClips = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const url = new URL('/api/clips', window.location.origin);
            url.searchParams.append('category', category);
            url.searchParams.append('sortType', sortType);
            url.searchParams.append('page', page.toString());

            console.log(`Fetching clips from ${url.toString()}`);
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || 'Failed to fetch clips');
            }
            const { clips: fetchedClips, hasMore: fetchedHasMore, error: apiError } = await response.json();

            if (apiError) {
                console.error('API returned error:', apiError);
                throw new Error(apiError);
            }

            if (fetchedClips.length === 0) {
                setError('Aucun clip trouvé pour cette catégorie. Vérifiez si des clips existent sur le channel Twitch.');
            }

            setClips(fetchedClips);
            setHasMore(fetchedHasMore);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des clips.';
            console.error('Error fetching clips:', errorMessage);
            setClips([]);
            setHasMore(false);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        fetchClips(newPage);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
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

            {/* Contenu */}
            <main className="w-full max-w-6xl mx-auto px-4 my-8">
                <h2 className="text-4xl font-extrabold mb-2">
                    Clips {category === 'week' ? 'de la semaine' : category === 'month' ? 'du mois' : 'globaux'}
                </h2>

                {/* Filtres */}
                <div className="flex flex-col gap-4 items-start mb-8">
                    {/* Catégories */}
                    <div className="flex gap-4">
                        {[
                            { key: 'week', label: 'Semaine' },
                            { key: 'month', label: 'Mois' },
                            { key: 'global', label: 'Global' },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setCategory(btn.key as 'week' | 'month' | 'global')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${category === btn.key ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Tri */}
                    <div className="flex gap-4">
                        {[
                            { key: 'views', label: 'Par vues' },
                            { key: 'recent', label: 'Date récent' },
                            { key: 'old', label: 'Date ancien' },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setSortType(btn.key as 'views' | 'recent' | 'old')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${sortType === btn.key ? 'bg-pink-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400">Chargement des clips...</p>
                ) : error ? (
                    <p className="text-center text-red-400">{error}</p>
                ) : clips.length === 0 ? (
                    <p className="text-center text-gray-400">Aucun clip disponible pour le moment.</p>
                ) : (
                    <ClipsClient
                        clips={clips}
                        title=""
                        currentPage={currentPage}
                        hasMore={hasMore}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>
        </div>
    );
}