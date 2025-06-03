// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)", // Appliquer à toutes les routes
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              frame-src 'self' https://clips.twitch.tv;
              connect-src 'self' https://api.twitch.tv https://gql.twitch.tv;
              font-src 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
