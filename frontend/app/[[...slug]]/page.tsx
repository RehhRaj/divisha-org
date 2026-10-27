

import HomePage from "@/app/HomePage";


export default function Page() {
  // STEP 1: API se aane wala data abhi hard-coded hai.
  // Output dekhne ke liye in values ko change karein.

  const site = {
    level: "tenant",
    template: "society",
  };

  // STEP 2: Data ke base par page select karein.

 
  if (site.level === "tenant" && site.template === "school") {
    return <h1>School Website</h1>;
  }

  if (site.level === "tenant" && site.template === "society") {
    return <HomePage />;
  }

   if (site.level === "platform") {
    return <h1>Business OS Home Page</h1>;
  }


  return <h1>Website Not Configured</h1>;
}
