import { useEffect } from "react";

export default function WildfireGuide() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Wildfire Guide</h1>
      
      {/* Wildfire Readiness Section */}
      <section id="wildfire-readiness" className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wildfire Readiness</h2>
        <p className="text-gray-700">
          Learn how to prepare with evacuation plans and essentials.
        </p>
      </section>
      
      {/* Wildfire Monitoring Section */}
      <section id="wildfire-monitoring" className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wildfire Monitoring</h2>
        <p className="text-gray-700">
          Stay updated on wildfire alerts and air quality.
        </p>
      </section>
      
      {/* Post-Fire Recovery Section */}
      <section id="post-fire-recovery" className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post-Fire Recovery</h2>
        <p className="text-gray-700">
          Support recovery through rebuilding and restoration efforts.
        </p>
      </section>
    </div>
  );
}
