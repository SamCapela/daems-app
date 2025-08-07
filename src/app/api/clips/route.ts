import { NextRequest, NextResponse } from 'next/server';

interface TwitchClip {
    id: string;
    title: string;
    thumbnail_url: string;
    view_count: number;
    creator_name: string;
    created_at: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as 'week' | 'month' | 'global' | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortType = searchParams.get('sortType') as 'views' | 'recent' | 'old' | null;

    const clipsPerPage = 15;
    let clips: TwitchClip[] = [];
    let cursor: string | undefined;

    try {
        // Validate environment variables
        if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
            console.error('Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET');
            return NextResponse.json(
                { error: 'Server configuration error: Missing Twitch credentials' },
                { status: 500 }
            );
        }

        // Fetch Twitch OAuth token
        console.log('Fetching Twitch OAuth token...');
        const tokenResponse = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
            { method: 'POST', cache: 'no-store' }
        );
        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Failed to fetch Twitch token:', tokenResponse.status, errorText);
            throw new Error(`Failed to fetch Twitch token: ${tokenResponse.status}`);
        }
        const { access_token } = await tokenResponse.json();
        console.log('Twitch token fetched successfully');

        // Set time filters for week/month
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);

        // Fetch clips
        console.log(`Fetching clips for category: ${category}, page: ${page}`);
        do {
            const url = new URL('https://api.twitch.tv/helix/clips');
            url.searchParams.append('broadcaster_id', '441069979'); // Daems_ broadcaster ID
            url.searchParams.append('first', category === 'global' ? '100' : clipsPerPage.toString());
            if (cursor) url.searchParams.append('after', cursor);
            if (category === 'week') {
                url.searchParams.append('started_at', oneWeekAgo.toISOString());
                url.searchParams.append('ended_at', now.toISOString());
            } else if (category === 'month') {
                url.searchParams.append('started_at', oneMonthAgo.toISOString());
                url.searchParams.append('ended_at', now.toISOString());
            }

            console.log(`Fetching clips from: ${url.toString()}`);
            const response = await fetch(url, {
                headers: {
                    'Client-Id': process.env.TWITCH_CLIENT_ID!,
                    Authorization: `Bearer ${access_token}`,
                    'Cache-Control': 'no-store',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Twitch API error:', response.status, errorText);
                throw new Error(`Twitch API error: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Received ${data.data.length} clips, cursor: ${data.pagination?.cursor || 'none'}`);
            clips = [...clips, ...data.data];
            cursor = category === 'global' ? data.pagination?.cursor : undefined;
        } while (cursor && category === 'global'); // Fetch all pages for global

        // Sort clips
        const sortFunctions = {
            views: (a: TwitchClip, b: TwitchClip) => b.view_count - a.view_count,
            recent: (a: TwitchClip, b: TwitchClip) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            old: (a: TwitchClip, b: TwitchClip) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        };
        if (sortType) clips.sort(sortFunctions[sortType]);

        // Paginate clips
        const start = (page - 1) * clipsPerPage;
        const paginatedClips = clips.slice(start, start + clipsPerPage);
        const hasMore = clips.length > start + clipsPerPage;

        console.log(`Returning ${paginatedClips.length} clips for page ${page}, hasMore: ${hasMore}`);
        return NextResponse.json({ clips: paginatedClips, hasMore });
    } catch (error) {
        console.error('Error fetching clips:', error);
        return NextResponse.json({ clips: [], hasMore: false, error: String(error) }, { status: 500 });
    }
}