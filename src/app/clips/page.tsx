// src/app/clips/page.tsx
import Link from 'next/link';
import { TwitchClip } from '@/app/types/TwitchClip';
import ClipsClient from './ClipsClient';

export default async function Clips() {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;

    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - 30);
    const startedAtISO = startedAt.toISOString().replace(/.\d+Z$/g, 'Z');

    const clipsResponse = await fetch(
        `https://api.twitch.tv/helix/clips?broadcaster_id=441069979&started_at=${startedAtISO}`,
        {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
            },
        }
    );
    const clipsData = await clipsResponse.json();
    console.log('API response status:', clipsResponse.status, clipsResponse.statusText);
    console.log('Clips API response:', clipsData);

    const clips: TwitchClip[] = clipsData.data?.sort(
        (a: TwitchClip, b: TwitchClip) => b.view_count - a.view_count
    ) || [];

    const clipsWithVideoUrls = clips.map((clip) => {
        const videoUrl = clip.thumbnail_url
            ? clip.thumbnail_url.replace(/-preview-\d+x\d+\.jpg$/, '.mp4')
            : null;
        console.log(`Derived video URL for clip ${clip.id}: ${videoUrl}`);
        return { ...clip, videoUrl };
    });

    return <ClipsClient clips={clipsWithVideoUrls} />;
}