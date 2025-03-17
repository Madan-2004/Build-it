import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const ElectionPage = () => {
  const [elections, setElections] = useState({
    ongoing: [],
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(() => {
    // Account for IST timezone (UTC+5:30)
    const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() + 5);
    // currentDate.setMinutes(currentDate.getMinutes() + 30);
    return currentDate;
  });
  console.log("Current Time:", now);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}elections/`, { withCredentials: true });
        const currentDate = new Date();
        
        const categorizedElections = response.data.reduce((acc, election) => {
          // Convert dates to Date objects and validate them
          const start = new Date(election.start_date);
          start.setHours(start.getHours() - 5, start.getMinutes() - 30);
          
          const end = new Date(election.end_date);
          end.setHours(end.getHours() - 5, end.getMinutes() - 30);
          
          console.log(election.title, start, end,election.start_date,election.end_date);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error(`Invalid date for election ${election.id}: ${election.title}`);
            return acc;
          }

          // Enhanced categorization logic
          if (currentDate >= start && currentDate <= end) {
            acc.ongoing.push({ ...election, start, end });
          } else if (currentDate < start) {
            acc.upcoming.push({ ...election, start, end });
          } else {
            acc.past.push({ ...election, start, end });
          }
          return acc;
        }, { ongoing: [], upcoming: [], past: [] });

        // Sort elections by relevant dates
        categorizedElections.ongoing.sort((a, b) => a.end - b.end); // Soonest ending first
        categorizedElections.upcoming.sort((a, b) => a.start - b.start); // Soonest starting first
        categorizedElections.past.sort((a, b) => b.end - a.end); // Most recently ended first

        setElections(categorizedElections);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setError("Failed to load elections. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
    
    // Update current time every minute
    const interval = setInterval(() => {
      const updatedDate = new Date();
      // updatedDate.setHours(updatedDate.getHours() + 5);
      // updatedDate.setMinutes(updatedDate.getMinutes() + 30);
      setNow(updatedDate);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  

  return (
    <div className="bg-gray-100 min-h-screen p-3 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white p-4 md:p-6 lg:p-8 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Elections</h1>
          
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <ElectionSection
              title="Ongoing Elections"
              elections={elections.ongoing}
              type="ongoing"
              now={now}
              color="blue"
            />
            
            <ElectionSection
              title="Upcoming Elections"
              elections={elections.upcoming}
              type="upcoming"
              now={now}
              color="green"
            />
            
            <ElectionSection
              title="Past Elections"
              elections={elections.past}
              type="past"
              now={now}
              color="gray"
            />
          </>
        )}
      </div>
    </div>
  );
};

const ElectionSection = ({ title, elections, type, now, color }) => {
  const colorClasses = {
    blue: "text-blue-600 border-blue-600",
    green: "text-green-600 border-green-600",
    gray: "text-gray-600 border-gray-600"
  };

  return (
    <section className="mb-8">
      <h2 className={`text-lg md:text-xl font-semibold mb-3 border-b-2 pb-2 ${colorClasses[color]}`}>
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">({elections.length})</span>
      </h2>
      {elections.length > 0 ? (
        <ElectionTable elections={elections} type={type} now={now} color={color} />
      ) : (
        <div className="bg-gray-50 p-4 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No {title.toLowerCase()} available</p>
        </div>
      )}
    </section>
  );
};

const ElectionTable = ({ elections, type, now, color }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-500"
    },
    green: {
      bg: "bg-green-500",
      hover: "hover:bg-green-600", 
      light: "bg-green-50",
      text: "text-green-500"
    },
    gray: {
      bg: "bg-gray-700",
      hover: "hover:bg-gray-800",
      light: "bg-gray-50",
      text: "text-gray-500"
    }
  };

  const getActionButton = (election) => {
    if (type === "ongoing") {
      const votingOpen = now >= election.start && now <= election.end;
      return votingOpen ? (
        election.has_voted ? (
          <span className="flex items-center justify-center text-green-600 font-medium">
            <CheckCircleIcon className="w-5 h-5 mr-1" /> Voted
          </span>
        ) : (
          <Link
            to={`/vote/${election.id}`}
            className={`${colorMap[color].bg} ${colorMap[color].hover} text-white px-4 py-2 rounded-md transition-colors inline-flex items-center justify-center`}
          >
            <VoteIcon className="w-4 h-4 mr-1" /> Vote Now
          </Link>
        )
      ) : (
        <span className="text-gray-400 flex items-center justify-center">
          <LockIcon className="w-4 h-4 mr-1" /> Voting Closed
        </span>
      );
    }

    if (type === "past") {
      return election.display_results ? (
        <Link
          to={`/elections/${election.id}/results`}
          className={`${colorMap.gray.bg} ${colorMap.gray.hover} text-white px-4 py-2 rounded-md transition-colors inline-flex items-center justify-center`}
        >
          <ChartIcon className="w-4 h-4 mr-1" /> Results
        </Link>
      ) : (
        <span className="text-gray-400 flex items-center justify-center">
          <ClockIcon className="w-4 h-4 mr-1" /> Pending
        </span>
      );
    }

    return (
      <span className="text-gray-400 flex items-center justify-center">
        <CalendarIcon className="w-4 h-4 mr-1" /> Not Started
      </span>
    );
  };

  // Function to get status text and color
  const getStatus = (election) => {
    if (type === "ongoing") {
      const daysLeft = Math.ceil((election.end - now) / (1000 * 3600 * 24));
      const hoursLeft = Math.ceil((election.end - now) / (1000 * 3600));
      
      if (daysLeft > 1) {
        return {
          text: `${daysLeft} days left`,
          className: colorMap[color].text
        };
      } else if (hoursLeft > 0) {
        return {
          text: `${hoursLeft} hours left`,
          className: "text-orange-500 font-medium"
        };
      } else {
        return {
          text: "Ending soon",
          className: "text-red-500 font-medium animate-pulse"
        };
      }
    } else if (type === "upcoming") {
      const daysToStart = Math.ceil((election.start - now) / (1000 * 3600 * 24));
      return {
        text: `Starts in ${daysToStart} days`,
        className: colorMap[color].text
      };
    } else {
      return {
        text: "Completed",
        className: "text-gray-500"
      };
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className={colorMap[color].light}>
            <th className="p-3 text-left border-b">Election</th>
            <th className="p-3 text-left border-b hidden sm:table-cell">Duration</th>
            <th className="p-3 text-center border-b">Status</th>
            <th className="p-3 text-center border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {elections
            .filter(election => election.display_election)
            .map((election) => {
              const status = getStatus(election);
              return (
                <tr key={election.id} className="hover:bg-gray-50 border-b last:border-b-0">
                  <td className="p-3 font-medium">
                    <div className="flex flex-col">
                      <span>{election.title}</span>
                      <span className="text-xs text-gray-500 mt-1 sm:hidden">
                        {formatDateRange(election.start, election.end)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {formatDateRange(election.start, election.end)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`whitespace-nowrap ${status.className}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="p-3 text-center">{getActionButton(election)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

// Improved date formatting
const formatDate = (date) => {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleDateString("en-IN", options);
};

const formatDateRange = (start, end) => {
  // Format dates beautifully
  const sameDay = start.getDate() === end.getDate() && 
                 start.getMonth() === end.getMonth() && 
                 start.getFullYear() === end.getFullYear();
  
  const startOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  if (sameDay) {
    return (
      <div className="flex flex-col text-sm">
        <span>{start.toLocaleDateString("en-IN", startOptions)}</span>
        <span className="text-gray-500">
          {start.toLocaleTimeString("en-IN", timeOptions)} - {end.toLocaleTimeString("en-IN", timeOptions)}
        </span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col text-sm">
        <div className="mb-1">
          <span className="font-medium">From:</span> {start.toLocaleDateString("en-IN", startOptions)}, {start.toLocaleTimeString("en-IN", timeOptions)}
        </div>
        <div>
          <span className="font-medium">To:</span> {end.toLocaleDateString("en-IN", startOptions)}, {end.toLocaleTimeString("en-IN", timeOptions)}
        </div>
      </div>
    );
  }
};

// Icon components

const VoteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="ml-2 text-gray-600">Loading elections...</span>
  </div>
);

export default ElectionPage;