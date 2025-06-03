// src/app/clips/page.tsx
import { TwitchClip } from '@/app/types/TwitchClip';
import ClipsClient from './ClipsClient';

interface ClipsResponse {
    data: TwitchClip[];
    pagination?: { cursor?: string };
}

export default async function Clips() {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;

    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - 30);
    const startedAtISO = startedAt.toISOString().replace(/.\d+Z$/g, 'Z');

    let allClips: TwitchClip[] = [];
    let cursor: string | undefined = undefined;

    // Paginate through all clips
    do {
        const url = new URL('https://api.twitch.tv/helix/clips');
        url.searchParams.append('broadcaster_id', '441069979');
        url.searchParams.append('started_at', startedAtISO);
        url.searchParams.append('first', '100'); // Max per page
        if (cursor) url.searchParams.append('after', cursor);

        const clipsResponse = await fetch(url.toString(), {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
            },
        });

        const clipsData: ClipsResponse = await clipsResponse.json();
        console.log('API response status:', clipsResponse.status, clipsResponse.statusText);
        console.log('Clips API response:', clipsData);

        if (clipsData.data) {
            allClips.push(...clipsData.data);
        }

        cursor = clipsData.pagination?.cursor;
    } while (cursor);

    // Sort clips by view count (descending)
    const sortedClips = allClips.sort((a, b) => b.view_count - a.view_count);

    // We’ll remove videoUrl derivation since we’re using iframes now
    return <ClipsClient clips={sortedClips} />;
}