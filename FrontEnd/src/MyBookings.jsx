// MyBookings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, DollarSign, User, Clock, X } from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, cancelled, completed
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/bookings/my-bookings", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setBookings(result.bookings);
      } else {
        setError(result.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/cancel-booking/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason: cancelReason })
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Booking cancelled successfully!");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? result.booking : b))
        );
        setCancellingId(null);
        setCancelReason("");
      } else {
        alert(result.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Error cancelling booking");
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-md p-5 flex items-center gap-4 border-b-4 border-[#FF385C]">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[#FF385C] hover:text-[#e0314f] transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-[#FF385C]">My Bookings</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {["all", "pending", "confirmed", "cancelled", "completed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                    filter === status
                      ? "bg-[#FF385C] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-[#FF385C]"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} (
                  {bookings.filter((b) => status === "all" || b.status === status)
                    .length}
                  )
                </button>
              )
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Bookings
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings`}
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-block bg-[#FF385C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Property Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {booking.propertyTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Type: {booking.propertyType === "home" ? "Home" : "Service"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <User size={14} /> Host: {booking.hostName}
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Check-in</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF385C]" />
                        {formatDate(booking.checkInDate)}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 mb-2">Check-out</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF385C]" />
                        {formatDate(booking.checkOutDate)}
                      </p>
                    </div>

                    {/* Price Info */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Total Price</p>
                      <p className="text-2xl font-bold text-[#FF385C] mb-3">
                        ${booking.totalPrice}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {booking.numberOfNights} night{booking.numberOfNights > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${booking.pricePerNight}/night
                      </p>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col justify-between">
                      {/* Status Badge */}
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          Guests: {booking.guestCount}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <button
                            onClick={() => setCancellingId(booking._id)}
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                          >
                            <X size={14} className="inline mr-1" />
                            Cancel
                          </button>
                        )}
                        {booking.status === "confirmed" &&
                          new Date(booking.checkOutDate) > new Date() && (
                            <button
                              onClick={() => setCancellingId(booking._id)}
                              className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                            >
                              <X size={14} className="inline mr-1" />
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Special Requests:
                      </p>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cancel Booking Modal */}
      {cancellingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Booking?</h2>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent mb-4 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleCancelBooking(cancellingId)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => {
                  setCancellingId(null);
                  setCancelReason("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-gray-500 border-t">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
