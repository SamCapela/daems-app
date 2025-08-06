/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)', // toutes les routes
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-src https://clips.twitch.tv https://player.twitch.tv;",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
