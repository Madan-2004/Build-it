import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Link, Mail } from 'react-feather';
import { format } from 'date-fns';

export default function EventCard({ event, viewMode }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className={`cursor-pointer ${
        viewMode === 'grid'
          ? 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          : 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex'
      }`}
    >
      <div className={viewMode === 'grid' ? '' : 'w-1/4'}>
        <img
          src={event.image || '/default-event.jpg'}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className={`p-4 ${viewMode === 'grid' ? '' : 'w-3/4'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <span className={`px-2 py-1 rounded text-sm ${
            event.status === 'published' ? 'bg-green-100 text-green-800' :
            event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status_display}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.start_date), 'PPP')}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.start_date), 'p')}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{event.fees}</span>
          </div>

          {event.register_link && (
            <div className="flex items-center text-blue-600">
              <Link className="w-4 h-4 mr-2" />
              <a 
                href={event.register_link} 
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Register
              </a>
            </div>
          )}

          {event.contact && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{event.contact}</span>
            </div>
          )}
        </div>

        {event.club && (
          <div className="mt-4 text-sm text-blue-600">
            Organized by {event.club.name}
          </div>
        )}
      </div>
    </div>
  );
}