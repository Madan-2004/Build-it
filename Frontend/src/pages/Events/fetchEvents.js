import fetch from "node-fetch"; // Import instead of require

const API_URL = "http://127.0.0.1:8000/api/events/";

const fetchEvents = async () => {
  try {
    console.log("📡 Fetching events from API...");

    const response = await fetch(API_URL);
    
    console.log("🔍 Response status:", response.status);

    if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);

    const events = await response.json();
    
    console.log("📜 Raw events data from API:", JSON.stringify(events, null, 2));

  } catch (error) {
    console.error("❌ Error fetching events:", error);
  }
};

fetchEvents();
