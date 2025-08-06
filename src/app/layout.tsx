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
                
            </head>
            <body>{children}</body>
        </html>
    );
}