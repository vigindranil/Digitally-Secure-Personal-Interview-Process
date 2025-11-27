import withPWA from "next-pwa";

const baseConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Provide an explicit (empty) turbopack config so Next recognizes turbopack settings
  turbopack: {},

  // Note: `experimental.turbo` removed — Turbopack flags can be
  // incompatible with next-pwa and may be rejected by some Next versions.
};

// Wrap config with PWA plugin
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(baseConfig);
