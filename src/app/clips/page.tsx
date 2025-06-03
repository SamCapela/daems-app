import Link from 'next/link';
import { TwitchClip } from '@/app/types/TwitchClip';

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
            <header className="w-full max-w-6xl px-4 py-6">
                <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Clips de Daems_
                </h1>
                <p className="text-center text-lg mt-2 text-gray-300">
                    Les meilleurs clips de la semaine, triés par popularité !
                </p>
                <nav className="mt-4 text-center">
                    <Link href="/" className="text-purple-400 hover:underline mx-4">
                        Accueil
                    </Link>
                    <Link href="/clips" className="text-purple-400 hover:underline mx-4">
                        Clips
                    </Link>
                </nav>
            </header>

            <section className="w-full max-w-4xl px-4 my-8">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {clipsWithVideoUrls.length > 0 ? (
                        clipsWithVideoUrls.map((clip) => (
                            <div
                                key={clip.id}
                                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500"
                            >
                                <h3 className="text-lg font-semibold text-white">{clip.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{clip.view_count} vues</p>
                                <div className="mt-2">
                                    {clip.videoUrl ? (
                                        <video
                                            src={clip.videoUrl}
                                            controls
                                            autoPlay={false}
                                            muted
                                            width="100%"
                                            height="200"
                                            className="rounded-md"
                                            onError={(e) => console.error(`Video error for clip ${clip.id}:`, e)}
                                        >
                                            Votre navigateur ne supporte pas la balise vidéo.
                                        </video>
                                    ) : (
                                        <p className="text-gray-400">Vidéo indisponible.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">Aucun clip trouvé cette semaine.</p>
                    )}
                </div>
            </section>

            <footer className="w-full py-6 bg-gray-900 text-center">
                <p className="text-gray-400">
                    Suivez{' '}
                    <a href="https://twitch.tv/daems_" className="text-purple-400 hover:underline">
                        Daems_
                    </a>{' '}
                    sur Twitch pour ne rien manquer !
                </p>
            </footer>
        </div>
    );
}