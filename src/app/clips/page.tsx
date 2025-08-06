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

    const [currentPage, setCurrentPage] = useState(1);
    const [cursorMap, setCursorMap] = useState<{ [page: number]: string | undefined }>({});
    const [hasMore, setHasMore] = useState(true);

    const clipsPerPage = 9;

    const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const TWITCH_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN;

    useEffect(() => {
        setCurrentPage(1);
        setCursorMap({});
        fetchClips(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, sortType]);

    const fetchClips = async (page: number) => {
        if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) return;

        setLoading(true);

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);

        const url = new URL('https://api.twitch.tv/helix/clips');
        url.searchParams.append('broadcaster_id', '441069979');
        url.searchParams.append('first', clipsPerPage.toString());

        if (category === 'week') {
            url.searchParams.append('started_at', oneWeekAgo.toISOString());
            url.searchParams.append('ended_at', now.toISOString());
        } else if (category === 'month') {
            url.searchParams.append('started_at', oneMonthAgo.toISOString());
            url.searchParams.append('ended_at', now.toISOString());
        }

        if (page > 1 && cursorMap[page]) {
            url.searchParams.append('after', cursorMap[page]);
        }

        const response = await fetch(url.toString(), {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${TWITCH_ACCESS_TOKEN!}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Erreur API Twitch');
            setLoading(false);
            return;
        }

        const json = await response.json();

        const sortFunctions = {
            views: (a: TwitchClip, b: TwitchClip) => b.view_count - a.view_count,
            recent: (a: TwitchClip, b: TwitchClip) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            old: (a: TwitchClip, b: TwitchClip) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        };

        const sortedData = [...json.data].sort(sortFunctions[sortType]);
        setClips(sortedData);

        if (json.pagination?.cursor) {
            setCursorMap((prev) => ({
                ...prev,
                [page + 1]: json.pagination.cursor,
            }));
            setHasMore(true);
        } else {
            setHasMore(false);
        }

        setLoading(false);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        fetchClips(newPage);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
            <header className="w-full bg-blue-900 shadow-md">
                <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-white">
                        Stream de Daems
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md">
                            Accueil
                        </Link>
                        <Link href="/clips" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md">
                            Clips
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="w-full max-w-6xl mx-auto px-4 my-8">
                <h2 className="text-4xl font-extrabold mb-2">
                    Clips {category === 'week' ? 'de la semaine' : category === 'month' ? 'du mois' : 'globaux'}
                </h2>

                <div className="flex flex-col gap-4 items-start mb-8">
                    <div className="flex gap-4">
                        {[
                            { key: 'week', label: 'Semaine' },
                            { key: 'month', label: 'Mois' },
                            { key: 'global', label: 'Global' },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setCategory(btn.key as 'week' | 'month' | 'global')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${category === btn.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500/40 hover:bg-blue-500/60 text-white/70'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {[
                            { key: 'views', label: 'Par vues' },
                            { key: 'recent', label: 'Date récent' },
                            { key: 'old', label: 'Date ancien' },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setSortType(btn.key as 'views' | 'recent' | 'old')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${sortType === btn.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500/40 hover:bg-blue-500/60 text-white/70'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-blue-200">Chargement des clips...</p>
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
