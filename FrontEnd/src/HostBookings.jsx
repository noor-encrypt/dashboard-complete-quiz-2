// HostBookings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Check,
  X,
  Eye,
  CheckCircle
} from "lucide-react";

export default function HostBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, confirmed, completed, all
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    fetchHostBookings();
  }, []);

  const fetchHostBookings = async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/bookings/host-bookings",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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

  const handleConfirmBooking = async (bookingId) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/confirm-booking/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Booking confirmed!");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? result.booking : b))
        );
        setConfirmingId(null);
      } else {
        alert(result.message || "Failed to confirm booking");
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Error confirming booking");
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/complete-booking/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Booking marked as completed!");
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? result.booking : b))
        );
        setCompletingId(null);
      } else {
        alert(result.message || "Failed to complete booking");
      }
    } catch (err) {
      console.error("Error completing booking:", err);
      alert("Error completing booking");
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
        <h1 className="text-2xl font-bold text-[#FF385C]">Booking Requests</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {["pending", "confirmed", "completed", "all"].map((status) => (
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
            ))}
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
                No Booking Requests
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "You haven't received any bookings yet"
                  : `No ${filter} bookings`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Guest Info */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Guest</p>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {booking.guestName}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        Guests: {booking.guestCount}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {booking.userId}
                      </p>
                    </div>

                    {/* Property Info */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Property</p>
                      <h3 className="font-semibold text-gray-800">
                        {booking.propertyTitle}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2">
                        Type:{" "}
                        {booking.propertyType === "home" ? "Home" : "Service"}
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Dates</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(booking.checkInDate)}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">to</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(booking.checkOutDate)}
                      </p>
                    </div>

                    {/* Price & Status */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Total Price</p>
                      <p className="text-2xl font-bold text-[#FF385C]">
                        ${booking.totalPrice}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <button
                            onClick={() => setConfirmingId(booking._id)}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm flex items-center justify-center gap-1"
                          >
                            <Check size={14} />
                            Confirm
                          </button>
                        )}
                        {booking.status === "confirmed" &&
                          new Date(booking.checkOutDate) <= new Date() && (
                            <button
                              onClick={() => setCompletingId(booking._id)}
                              className="flex-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition font-semibold text-sm flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={14} />
                              Complete
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Guest's Special Requests:
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

      {/* Confirm Booking Modal */}
      {confirmingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking?</h2>
            <p className="text-gray-600 mb-6">
              Once confirmed, the guest's payment will be processed and they'll be
              notified of your confirmation.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmBooking(confirmingId)}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setConfirmingId(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Booking Modal */}
      {completingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mark as Completed?</h2>
            <p className="text-gray-600 mb-6">
              Confirm that the guest has checked out and the booking is complete.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleCompleteBooking(completingId)}
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
              >
                Mark Complete
              </button>
              <button
                onClick={() => setCompletingId(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Guest Info */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedBooking.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Guests</p>
                    <p className="font-medium">{selectedBooking.guestCount}</p>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Property</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Title</p>
                    <p className="font-medium">{selectedBooking.propertyTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">
                      {selectedBooking.propertyType === "home" ? "Home" : "Service"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Dates */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Booking Dates</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {formatDate(selectedBooking.checkInDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {formatDate(selectedBooking.checkOutDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Nights</p>
                    <p className="font-medium">{selectedBooking.numberOfNights}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Night</span>
                    <span className="font-medium">${selectedBooking.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Nights</span>
                    <span className="font-medium">{selectedBooking.numberOfNights}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#FF385C] pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Booking Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status.charAt(0).toUpperCase() +
                        selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedBooking.paymentStatus.charAt(0).toUpperCase() +
                        selectedBooking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Special Requests
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full mt-6 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
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
