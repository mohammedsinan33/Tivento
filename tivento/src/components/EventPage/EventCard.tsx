import Link from "next/link";
import React from "react";
import { Event } from "./Supabase";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "silver":
        return "bg-gray-200 text-gray-900";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
          }
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Tier Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(
              event.tier
            )}`}
          >
            {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
          <div className="text-orange-600 font-bold text-lg">
            {formatDate(event.event_date)}
          </div>
          <div className="text-gray-600 text-sm">
            {formatTime(event.starting_time)}
          </div>
        </div>

        {/* Online/Offline Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.is_online
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {event.is_online ? "Online" : "In-Person"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-orange-600 font-medium">
            {event.Catogory}
          </span>
          <span className="text-sm text-gray-500">
            {event.price === 0 ? "Free" : `${event.Currency} ${event.price}`}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-4">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">
            {event.is_online
              ? "Online Event"
              : event.venue_name || event.Address || "Location TBD"}
          </span>
        </div>

        {/* Attendees and View Details Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm">Max {event.max_attendees} attendees</span>
          </div>
          <Link href={`/?page=event-details&id=${event.UUID}`}>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105">
              View Details
            </button>
          </Link>
        </div>

        {/* Tags */}
        {event.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags
              .split(",")
              .slice(0, 3)
              .map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
