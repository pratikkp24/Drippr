/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "assets.myntassets.com" },
      { protocol: "https", hostname: "assets.ajio.com" },
      { protocol: "https", hostname: "images.nykaafashion.com" },
      { protocol: "https", hostname: "static.zara.net" },
      { protocol: "https", hostname: "image.uniqlo.com" },
      { protocol: "https", hostname: "lp2.hm.com" },
      { protocol: "https", hostname: "st.mngbcn.com" },
      { protocol: "https", hostname: "aritzia.scene7.com" },
      { protocol: "https", hostname: "images.asos-media.com" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" }
    ]
  },
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Auto-upgrade any http:// subresource requests to https://. Kills the
          // "Not Secure" badge caused by mixed content (e.g. scraped product images).
          { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
          // HSTS — tells browsers to always use HTTPS for this domain (1 year).
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Misc hardening
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" }
        ]
      }
    ];
  }
};

export default nextConfig;
