import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Link as LinkIcon,
  Mail,
  Info,
  Share2,
  FileText,
} from "react-feather";
import EventForm from "./components/EventForm";
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/events/${id}/`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Failed to load event details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = event?.title || "Event";

    const shareData = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareData[platform], "_blank");
    setShowShareMenu(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/events/${id}/delete/`);
      toast.success("Event deleted successfully");
      navigate("/events");
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = async (formData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/events/${id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEvent(response.data);
      setShowEditForm(false);
      toast.success("Event updated successfully");
    } catch (error) {
      toast.error("Failed to update event. Please try again.");
      console.error("Error updating event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Event
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/events")}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with responsive styling */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            {/* Back Button */}
            <button
              onClick={() => navigate("/events")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 
                 rounded-md shadow-sm text-sm font-medium text-gray-700 
                 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-blue-500 md:px-3 md:py-2"
            >
              <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline ml-2">Back to Events</span>
            </button>

            {/* Button Group */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 
                     rounded-md shadow-sm text-sm font-medium text-gray-700 
                     bg-white hover:bg-gray-50 md:px-4"
                >
                  <Share2 className="w-5 h-5 md:w-4 md:h-4" />
                  <span className="hidden md:inline ml-2">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 
                     ring-black ring-opacity-5 z-10"
                  >
                    <div className="py-1" role="menu">
                      {["facebook", "twitter", "linkedin"].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
                           text-left capitalize"
                          role="menuitem"
                        >
                          Share on {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500 md:px-4"
              >
                <Edit className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline ml-2">Edit</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white bg-red-600 
                   hover:bg-red-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-red-500 md:px-4"
              >
                <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline ml-2">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {showEditForm && (
          <EventForm
            onSubmit={handleEdit}
            onClose={() => setShowEditForm(false)}
            initialData={{
              ...event,
              start_date: format(
                new Date(event.start_date),
                "yyyy-MM-dd'T'HH:mm"
              ),
              end_date: format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm"),
            }}
          />
        )}

        {/* Event Image */}
        {event.image && (
          <div className="mb-8">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-[#002c59] mb-4">
              {event.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === "published"
                  ? "bg-green-100 text-green-800"
                  : event.status === "draft"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.status_display}
            </span>
          </div>

          {/* Event Info - Updated Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <div>
                <span className="block">
                  Start: {format(new Date(event.start_date), "PPP")}
                </span>
                <span className="block text-sm">
                  {format(new Date(event.start_date), "p")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <div>
                <span className="block">
                  End: {format(new Date(event.end_date), "PPP")}
                </span>
                <span className="block text-sm">
                  {format(new Date(event.end_date), "p")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>{event.fees}</span>
            </div>

            {event.register_link && (
              <div className="flex items-center text-blue-600">
                <LinkIcon className="w-5 h-5 mr-2" />
                <a
                  href={event.register_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Registration Link
                </a>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2" />
              <a
                href={`mailto:${event.contact}`}
                className="hover:text-blue-600"
              >
                {event.contact}
              </a>
            </div>

            {event.club && (
              <div className="flex items-center text-blue-600">
                <Info className="w-5 h-5 mr-2" />
                <span>Organized by {event.club.name}</span>
              </div>
            )}

            {event.pdf && (
              <div className="flex items-center text-blue-600">
                <FileText className="w-5 h-5 mr-2" />
                <a
                  href={event.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  View Event PDF
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Event Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Event Status</h3>
            <div className="flex flex-wrap gap-2">
              {event.is_upcoming && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Upcoming
                </span>
              )}
              {event.is_ongoing && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Ongoing
                </span>
              )}
              {event.is_past && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  Past
                </span>
              )}
            </div>
          </div>

          {/* Categories */}
          {event.categories && event.categories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {event.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Created/Updated Info */}
          <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
            <p>Created: {format(new Date(event.created_at), "PPP p")}</p>
            <p>Last Updated: {format(new Date(event.updated_at), "PPP p")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
