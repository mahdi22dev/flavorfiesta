// Only init Cloudflare dev proxy if explicitly enabled (set OPENNEXT_CLOUDFLARE_DEV=1)
// By default this is off — it requires wrangler login (remote mode) which most devs
// don't need for local UI work. Enable it when you need D1/R2 access locally.
if (process.env.OPENNEXT_CLOUDFLARE_DEV === "1") {
  try {
    const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  } catch {
    console.warn("[opennext] Failed to init Cloudflare dev proxy — running without D1/R2");
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
