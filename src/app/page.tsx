"use client";

export default function Home() {
    const schedule = [
        { day: "Lundi", match: "GLX vs Stonks", time: "18h" },
        { day: "Mercredi", match: "Les Zamis vs Marzen", time: "19h" },
        { day: "Vendredi", match: "Remplaçants vs TDS", time: "-" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
            <header className="w-full max-w-6xl px-4 py-6">
                <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Daems_ Twitch
                </h1>
                <p className="text-center text-lg mt-2 text-gray-300">
                    Rejoignez Daems_ pour des streams épiques et des matchs LoL explosifs !
                </p>
            </header>

            <section className="w-full max-w-4xl px-4 my-8">
                <div className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-purple-500">
                    <iframe
                        src="https://player.twitch.tv/?channel=daems_&parent=daems-app.vercel.app"
                        height="480"
                        width="100%"
                        allowFullScreen
                        className="aspect-video"
                    ></iframe>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                </div>
            </section>

            <section className="w-full max-w-4xl px-4 mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">
                    Planning des Matchs (League of Legends)
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {schedule.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500"
                        >
                            <h3 className="text-xl font-semibold text-white">{item.day}</h3>
                            <p className="text-gray-300 mt-2">{item.match}</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {item.time !== "-" ? `À ${item.time}` : "Horaire TBD"}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="w-full py-6 bg-gray-900 text-center">
                <p className="text-gray-400">
                    Suivez <a href="https://twitch.tv/daems_" className="text-purple-400 hover:underline">Daems_</a> sur Twitch pour ne rien manquer !
                </p>
            </footer>
        </div>
    );
}