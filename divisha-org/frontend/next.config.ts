import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be opened via subdomains such as abc.school.localhost,
  // and via the dummy custom domains (add them to /etc/hosts, see README).
  allowedDevOrigins: ["*.localhost", "localhost", "abc.com", "ss.com", "hscb.com", "norw.com"],
};

export default nextConfig;
