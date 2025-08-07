import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Stream de Daems',
    description: 'Watch Daems’ clips and streams',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <head>
                <meta charSet="utf-8" />
                <meta
                    httpEquiv="Content-Security-Policy"
                    content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.twitch.tv https://player.twitch.tv; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.twitch.tv https://static-cdn.jtvnw.net data:; frame-src https://clips.twitch.tv https://player.twitch.tv https://www.twitch.tv; connect-src 'self' https://api.twitch.tv https://id.twitch.tv; frame-ancestors https://daems-app.vercel.app;"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}