// src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
    const response = NextResponse.next();

    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self';",
            "frame-src 'self' https://player.twitch.tv https://clips.twitch.tv https://www.twitch.tv https://embed.twitch.tv;",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.twitch.tv https://www.twitch.tv https://embed.twitch.tv;",
            "style-src 'self' 'unsafe-inline';",
            "connect-src 'self' https://api.twitch.tv wss://irc-ws.chat.twitch.tv https://www.twitch.tv;",
            "img-src 'self' https://static-cdn.jtvnw.net data:;"
        ].join(' ')
    );

    return response;
}

export const config = {
    matcher: '/:path*',
};