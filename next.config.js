// next.config.js
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)", // Appliquer à toutes les routes
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self';",
                            "script-src 'self' 'unsafe-inline';",
                            "style-src 'self' 'unsafe-inline';",
                            "img-src 'self' data: https:;",
                            "frame-src 'self' https://clips.twitch.tv;",
                            "connect-src 'self' https://api.twitch.tv https://gql.twitch.tv;",
                            "font-src 'self';",
                        ].join(" "),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
