import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpcomingEvents = () => {
  // State management
  const [events1, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const navigate = useNavigate();

  // Default events if none provided
  const defaultEvents = [
    {
      id: 1,
      title: 'React Workshop',
      start: new Date(2025, 2, 25, 10, 0),
      end: new Date(2025, 2, 25, 12, 0),
      category: 'workshop',
      description: 'Learn the fundamentals of React development with hands-on exercises and expert guidance.',
      organizer: 'Programming Club',
      location: 'Tech Hub, Room 101',
      url: '#workshop'
    },
    // ...other default events
  ];
  // Fetch events from the backend

  const API_URL = "http://localhost:8000/api/";
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}events/`); // Replace with your API endpoint
        const mappedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_date), // Changed from event.date
          end: new Date(event.end_date), // Changed from event.agenda.time
          category: event.categories?.[0]?.name?.toLowerCase() || 'default', // Handle categories
          description: event.description,
          organizer: event.club?.name || event.contact, // Use club name if available, fallback to contact
          location: event.location,
          url: event.register_link,
          status: event.status,
          image: event.image,
          pdf: event.pdf,
          fees: event.fees,
          contact: event.contact,
          is_past_event: event.is_past_event,
          is_upcoming_event: event.is_upcoming_event,
          is_ongoing_event: event.is_ongoing_event
        }));
        setEvents(mappedEvents);
        console.log('Fetched events m:', mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Use provided events or fall back to default events
  const events = useMemo(() => events1 || defaultEvents, [events1]);
  useEffect(() => {
    console.log('Events:', events);
  }, [events]);

  // Theme configuration
  const theme = {
    primary: 'blue',
    secondary: 'indigo',
    accent: 'purple',
    categories: {
      technical: { bg: 'bg-blue-500', text: 'text-blue-900', indicator: 'bg-blue-400' },
      cultural: { bg: 'bg-purple-500', text: 'text-purple-900', indicator: 'bg-purple-400' },
      sports: { bg: 'bg-green-500', text: 'text-green-900', indicator: 'bg-green-400' },
      workshops: { bg: 'bg-amber-500', text: 'text-amber-900', indicator: 'bg-amber-400' },
      default: { bg: 'bg-gray-500', text: 'text-gray-900', indicator: 'bg-gray-400' }
    }
  };
  // Helper to get category styling
  const getCategoryColor = (category) => {
    return theme.categories[category] || theme.categories.default;
  };

  // Calendar calculations
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = moment(currentDate).startOf('month').day();

  // Effect to update selected day events
  useEffect(() => {
    if (selectedDay) {
      const selectedDate = moment(currentDate).date(selectedDay);
      const dayStart = moment(selectedDate).startOf('day');
      const dayEnd = moment(selectedDate).endOf('day');

      // Simulate API fetch delay
      setIsLoading(true);
      setTimeout(() => {
        const filteredEvents = events.filter(event => {
          const eventStart = moment(event.start);
          return eventStart.isBetween(dayStart, dayEnd, null, '[]');
        });

        setSelectedDayEvents(filteredEvents);
        setIsLoading(false);
      }, 300);
    } else {
      setSelectedDayEvents([]);
    }
  }, [selectedDay, currentDate, events]);

  // Navigation functions
  const prevMonth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentDate(moment(currentDate).subtract(1, 'month'));
      setSelectedDay(null);
      setIsLoading(false);
    }, 200);
  };

  const nextMonth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentDate(moment(currentDate).add(1, 'month'));
      setSelectedDay(null);
      setIsLoading(false);
    }, 200);
  };

  // Reset to current month
  const goToToday = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentDate(moment());
      setSelectedDay(moment().date());
      setIsLoading(false);
    }, 200);
  };

  // Function to show upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = moment();
    const thirtyDaysLater = moment().add(30, 'days');

    return events
      .filter(event => {
        const eventDate = moment(event.start);
        return eventDate.isBetween(today, thirtyDaysLater, null, '[]');
      })
      .sort((a, b) => moment(a.start) - moment(b.start));
  };

  // Get upcoming events for display
  const upcomingEvents = useMemo(() => getUpcomingEvents(), [events]);

  // Process events for calendar display
  const processedCalendarData = useMemo(() => {
    // Generate blank spaces for days before the 1st of month
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendar = [...blanks, ...days];

    // Map events to their days
    const eventDays = events.reduce((acc, event) => {
      const eventDate = moment(event.start);
      const day = eventDate.date();
      const month = eventDate.month();
      const year = eventDate.year();

      if (month === currentDate.month() && year === currentDate.year()) {
        if (!acc[day]) acc[day] = [];
        acc[day].push({
          id: event.id,
          category: event.category,
          title: event.title
        });
      }
      return acc;
    }, {});

    return { calendar, eventDays };
  }, [currentDate, daysInMonth, events, firstDayOfMonth]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const { calendar, eventDays } = processedCalendarData;

    return calendar.map((day, index) => {
      const isToday = day === moment().date() &&
        currentDate.month() === moment().month() &&
        currentDate.year() === moment().year();
      const isSelected = selectedDay === day;
      const dayEvents = day ? eventDays[day] || [] : [];
      const hasEvents = dayEvents.length > 0;

      return (
        <div key={index} className="relative">
          {day && (
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={`
                w-full h-8 flex items-center justify-center rounded-lg
                ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'}
                ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-80 font-bold' : ''}
                ${hasEvents ? 'font-medium' : ''}
                ${isSelected && hasEvents ? 'bg-blue-50' : ''}
                hover:bg-gray-100 transition-all duration-200 cursor-pointer
                text-l relative group
              `}
            >
              {day}

              {/* Event indicators */}
              {hasEvents && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className={`
                        w-1 h-1 rounded-full ${getCategoryColor(event.category).indicator}
                        transform transition-all duration-200
                        group-hover:scale-150 group-hover:w-1.5 group-hover:h-1.5
                      `}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:scale-150 group-hover:w-1.5 group-hover:h-1.5 transition-all duration-200"
                      title={`${dayEvents.length - 3} more events`} />
                  )}
                </div>
              )}

              {/* Tooltip for events */}
              {hasEvents && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-10">
                  <div className="bg-white rounded-lg shadow-lg p-2 text-xs border border-gray-200">
                    {dayEvents.map((event, i) => (
                      <div key={i} className="flex items-center space-x-2 mb-1 last:mb-0">
                        <span className={`w-2 h-2 rounded-full ${getCategoryColor(event.category).indicator}`} />
                        <span className="text-gray-700 truncate">{event.title}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-white rotate-45 border-b border-r border-gray-200"></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      );
    });
  };
  // Format event time range
  const formatEventTime = (start, end) => {
    const startTime = moment(start).format('h:mm A');
    const endTime = moment(end).format('h:mm A');
    const isSameDay = moment(start).isSame(moment(end), 'day');

    if (isSameDay) {
      return `${startTime} - ${endTime}`;
    } else {
      const startDate = moment(start).format('MMM D');
      const endDate = moment(end).format('MMM D');
      return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Upcoming Events
          </h2>
          <div className="w-80 h-1 bg-blue-500 mx-auto rounded-full "></div>

        </div>

        {/* View toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm p-1 bg-gray-100">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${viewMode === 'calendar'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                } transition-all duration-200`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${viewMode === 'list'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                } transition-all duration-200`}
            >
              List View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calendar Side */}
          {viewMode === 'calendar' && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-3 bg-white rounded-xl p-4 shadow-lg border border-gray-100 mx-auto w-full"
              >
                {/* Calendar header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentDate.format('MMMM YYYY')}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={goToToday}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={prevMonth}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Previous month"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextMonth}
                      disabled={isLoading}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Next month"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-gray-600 text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {isLoading ? (
                    // Loading skeleton
                    Array(35).fill(0).map((_, index) => (
                      <div key={index}>
                        <div className="w-full h-8 rounded-lg bg-gray-100 animate-pulse"></div>
                      </div>
                    ))
                  ) : generateCalendarDays()}
                </div>

                {/* Legend */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(theme.categories).map(([category, colors]) => (
                      <div key={category} className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${colors.indicator}`} />
                        <span className="text-xs text-gray-600 capitalize">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Selected day events */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-3"
              >
                {selectedDay ? (
                  <>
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-50">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Events on {moment(currentDate).date(selectedDay).format('MMMM D, YYYY')}
                      </h3>

                      {isLoading ? (
                        // Loading skeleton for events
                        <div className="space-y-2">
                          {[1, 2].map(i => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {selectedDayEvents.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                             {selectedDayEvents.map(event => (
  <motion.div
    key={event.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 w-1.5 h-auto self-stretch mr-2">
        <div className={`${getCategoryColor(event.category).indicator} h-full rounded-full`}></div>
      </div>
      <div>
        <h4 className="font-medium text-xl text-gray-900">{event.title}</h4>
        <p className="text-xs text-gray-600">
          {formatEventTime(event.start, event.end)}
        </p>
        {event.location && (
          <p className="text-xs text-gray-500 mt-0.5">
            {event.location}
          </p>
        )}
      </div>
      <button
  onClick={() => navigate(`/events/${event.id}`)}
  className="ml-auto text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>
    </div>
  </motion.div>
))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4 text-l">
                              No events scheduled for this day.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-l font-medium text-gray-900 mb-1">Select a Date</h3>
                    <p className="text-gray-500 text-xs">
                      Click on a day to view scheduled events
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-l font-medium text-blue-800 mb-2">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <p className="text-xs text-gray-500">This Month</p>
                      <p className="text-lg font-bold text-gray-900">
                        {events.filter(e => moment(e.start).month() === currentDate.month()).length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <p className="text-xs text-gray-500">Upcoming</p>
                      <p className="text-lg font-bold text-gray-900">
                        {upcomingEvents.length}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="col-span-5 space-y-4"
            >
              <h3 className="text-lg font-semibold">Upcoming Events (Next 30 Days)</h3>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-50"
                     
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-base font-bold text-gray-900">
                              {moment(event.start).format('DD')}
                            </span>
                            <span className="text-xs text-gray-500 -mt-1">
                              {moment(event.start).format('MMM')}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className={`px-1.5 py-0.5 rounded-full text-xs inline-block font-medium ${getCategoryColor(event.category).bg} ${getCategoryColor(event.category).text} bg-opacity-20 mb-1`}>
                            {event.category}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-0.5 line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {formatEventTime(event.start, event.end)}
                          </p>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {event.description}
                          </p>

                          {event.location && (
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              By {event.organizer}
                            </span>
                            <button
                              onClick={() => navigate(`/events/${event.id}`)}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
                            >
                              Detailss →
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-base font-medium text-gray-700 mb-1">No Upcoming Events</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-l">
                    There are no events scheduled for the next 30 days. Check back later or view the calendar for future events.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;