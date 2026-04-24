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
  experimental: { serverActions: { bodySizeLimit: "8mb" } }
};

export default nextConfig;
