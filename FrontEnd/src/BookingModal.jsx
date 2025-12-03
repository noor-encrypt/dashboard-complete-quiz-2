// BookingModal.jsx
import React, { useState } from "react";
import { X, Calendar, Users, FileText } from "lucide-react";

export default function BookingModal({ property, propertyType, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guestCount: 1,
    specialRequests: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const numberOfNights = calculateNights();
  const totalPrice = numberOfNights * property.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("userToken");

    if (!token) {
      setError("Please login to make a booking");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.checkInDate || !formData.checkOutDate) {
      setError("Please select check-in and check-out dates");
      setLoading(false);
      return;
    }

    if (numberOfNights <= 0) {
      setError("Check-out date must be after check-in date");
      setLoading(false);
      return;
    }

    if (formData.guestCount < 1) {
      setError("Please select at least 1 guest");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/bookings/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          propertyType: propertyType,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          guestCount: parseInt(formData.guestCount),
          specialRequests: formData.specialRequests
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Booking created successfully! Waiting for host confirmation.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Error creating booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book {propertyType === 'home' ? 'Property' : 'Service'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{property.title}</h3>
            <p className="text-gray-600 text-sm">${property.price}/night</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-2" />
                Number of Guests
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                min="1"
                max={propertyType === 'home' ? property.guests : 10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests for the host?"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent resize-none"
              />
            </div>

            {/* Booking Summary */}
            {numberOfNights > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">${property.price} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''}</span>
                  <span className="font-semibold text-gray-800">${totalPrice}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#FF385C]">${totalPrice}</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || numberOfNights <= 0}
                className="flex-1 bg-[#FF385C] text-white py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Booking Policy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">Booking Policy:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Your booking will be pending until the host confirms</li>
              <li>You can cancel for free before the host confirms</li>
              <li>Confirmed bookings have a refund policy</li>
              <li>Payment will be processed after confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
