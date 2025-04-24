"use client";

export default function Home() {
    const schedule = [
        { day: "Lundi", match: "GLX vs Stonks", time: "18h" },
        { day: "Mercredi", match: "Les Zamis vs Marzen", time: "19h" },
        { day: "Vendredi", match: "Remplaçants vs TDS", time: "-" },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold mb-8">Bienvenue sur le site de Daems_</h1>

            {/* Lecteur Twitch via iframe */}
            <div className="w-full max-w-4xl mb-8">
                <iframe
                    src="https://player.twitch.tv/?channel=daems_&parent=daems-app.vercel.app"
                    height="480"
                    width="100%"
                    allowFullScreen
                ></iframe>
            </div>

            {/* Planning des matchs */}
            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-4">Planning des matchs (League of Legends)</h2>
                <ul className="space-y-2">
                    {schedule.map((item, index) => (
                        <li key={index} className="bg-gray-800 p-4 rounded-lg">
                            <span className="font-bold">{item.day} : </span>
                            {item.match} {item.time !== "-" && `(${item.time})`}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}