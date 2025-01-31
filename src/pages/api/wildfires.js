export default async function handler(req, res) {
    try {
      // Request CAL FIRE data from the remote endpoint.
      // This is *server-side* so we don't get blocked by CORS.
      const response = await fetch(
        "https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactiveIncidents=false"
      );
  
      // If the endpoint changed or is down, handle errors:
      if (!response.ok) {
        return res.status(response.status).json({
          error: `Failed to fetch data from CAL FIRE. Status ${response.status}`,
        });
      }
  
      // Convert to JSON
      const data = await response.json();
  
      // Respond to the client with the data
      // Next.js will automatically set appropriate headers so your browser can read it.
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in /api/wildfires:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  