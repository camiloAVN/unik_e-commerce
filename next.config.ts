import type { NextConfig } from "next";

function getR2Hostname(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

const r2Hostname = getR2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: 'https' as const, hostname: r2Hostname }]
        : []
      ),
    ],
  },
};

export default nextConfig;
