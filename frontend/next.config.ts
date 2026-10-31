// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental: {
//     agentFeedback: true,
//   },
//   cacheComponents: true,
//   partialPrefetching: true,
//   turbopack: {
//     rules: {
//       "*.css": {
//         loaders: ["@tailwindcss/turbopack"],
//         as: "*.css",
//       },
//     },
//   },
// };

// export default nextConfig;




// ************************************************
// *************************************************



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     agentFeedback: true,
//   },

//   // Temporarily disable Cache Components
//   // while testing hostname-based rendering.
//   cacheComponents: false,

//   turbopack: {
//     rules: {
//       "*.css": {
//         loaders: ["@tailwindcss/turbopack"],
//         as: "*.css",
//       },
//     },
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.137.24",
    "*.localhost",
  ],
};

export default nextConfig;