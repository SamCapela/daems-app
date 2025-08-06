'use client';

import Link from 'next/link';

// Define the shape of each activity item
interface Activity {
    id: number;
    type: 'sub' | 'donation';
    username: string;
    amount: string | null;
    message: string;
    timestamp: string;
}

// Placeholder data for subs/donations (replace with API data)
const recentActivity: Activity[] = [
    { id: 1, type: 'sub', username: 'Gamer123', amount: null, message: 'New subscriber!', timestamp: '2025-08-07 12:30' },
    { id: 2, type: 'donation', username: 'CoolFan', amount: '$5.00', message: 'Keep it up!', timestamp: '2025-08-07 12:25' },
    { id: 3, type: 'sub', username: 'ProPlayer', amount: null, message: 'Tier 2 sub!', timestamp: '2025-08-07 12:20' },
    { id: 4, type: 'donation', username: 'StreamLover', amount: '$10.00', message: 'Love the stream!', timestamp: '2025-08-07 12:15' },
    // Add more entries (up to 10)
];

// Component for rendering each activity card with typed props
interface ActivityCardProps {
    type: 'sub' | 'donation';
    username: string;
    amount: string | null;
    message: string;
    timestamp: string;
}

function ActivityCard({ type, username, amount, message, timestamp }: ActivityCardProps) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-purple-500 flex flex-col gap-2 hover:bg-gray-700 transition">
            <div className="flex items-center gap-2">
                <span className={`font-bold ${type === 'sub' ? 'text-purple-400' : 'text-pink-400'}`}>
                    {type === 'sub' ? 'Subscriber' : 'Donation'}
                </span>
                <span className="text-gray-300">by {username}</span>
            </div>
            {amount && <p className="text-gray-200">Amount: {amount}</p>}
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-gray-500 text-xs">{timestamp}</p>
        </div>
    );
}

export default function Home() {
    // In a real app, you'd fetch this data using useEffect or a server component
    // Example:
    // const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    // useEffect(() => {
    //     fetch('/api/subs-and-donations')
    //         .then(res => res.json())
    //         .then(data => setRecentActivity(data.slice(0, 10)));
    // }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
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

            {/* Section vidéo avec player et chat côte à côte */}
            <section className="w-full max-w-6xl px-4 my-8 flex gap-6 justify-center">
                {/* Lecteur Twitch */}
                <div className="flex-1 max-w-[720px] rounded-lg shadow-2xl overflow-hidden border-2 border-purple-500 relative">
                    <iframe
                        src="https://player.twitch.tv/?channel=daems_&parent=daems-app.vercel.app"
                        height="480"
                        width="100%"
                        allowFullScreen
                        className="aspect-video"
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                </div>

                {/* Chat Twitch with Scrollable Container and Dark Mode */}
                <div className="flex-1 max-w-[360px] rounded-lg shadow-2xl overflow-auto border-2 border-pink-500" style={{ maxHeight: '480px' }}>
                    <iframe
                        src="https://www.twitch.tv/embed/daems_/chat?parent=daems-app.vercel.app&darkpopout=1"
                        height="480"
                        width="100%"
                        className="bg-black"
                    />
                </div>
            </section>

            {/* Recent Subs/Donations Section */}
            <section className="w-full max-w-6xl px-4 my-8">
                <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Latest Supporters
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentActivity.slice(0, 10).map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            type={activity.type}
                            username={activity.username}
                            amount={activity.amount}
                            message={activity.message}
                            timestamp={activity.timestamp}
                        />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-6 bg-gray-900 text-center">
                <p className="text-gray-400">
                    Suivez{' '}
                    <a href="https://twitch.tv/daems_" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        Daems_
                    </a>{' '}
                    sur Twitch pour ne rien manquer !
                </p>
            </footer>
        </div>
    );
}