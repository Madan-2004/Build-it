const fetchEvents = async () => {
  try {
    console.log("📡 Fetching events from API...");

    const response = await fetch("http://127.0.0.1:8000/api/events/"); // Update API URL if needed

    console.log("🔍 Response status:", response.status);

    if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);

    const events = await response.json();
    
    console.log("📜 Raw events data from API:", JSON.stringify(events, null, 2));

    // Format the API response to match expected structure
    return events.map((event) => ({
      title: event.title,
      date: event.date,
      poster: event.poster || "/data/media/images/general/dummy.jpg",
      description: event.description,
      venue: event.venue,
      category: event.category,
      registerLink: event.register_link || "#",
      agenda: event.agenda || [],
      speakers: event.speakers || [],
      fees: event.fees || "Free Entry",
      schedule: event.schedule || "TBD",
      contact: event.contact || "info@iitindore.ac.in",
    }));
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return [];
  }
};

export default fetchEvents;
