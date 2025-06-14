import './globals.css';

export const metadata = {
    title: 'Daems App',
    description: 'Site pour Daems_ avec lecteur Twitch et planning des matchs',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <head>
                <meta
                    httpEquiv="Content-Security-Policy"
                    content="frame-ancestors 'self' https://player.twitch.tv; connect-src 'self' https://player.twitch.tv; frame-src 'self' https://player.twitch.tv;"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}