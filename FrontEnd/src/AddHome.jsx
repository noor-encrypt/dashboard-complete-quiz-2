// AddHome.jsx
import React, { useState } from "react";
import { ArrowLeft, Upload, X, Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddHome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    amenities: [],
  });
  const [images, setImages] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleImageAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("userToken");

    if (!token) {
      setErrorMessage("Token not found. Please login again.");
      setLoading(false);
      return;
    }

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.location.trim() ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.guests
    ) {
      setErrorMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setErrorMessage("Please add at least one image");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/homes/add-home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          guests: parseInt(formData.guests),
          images: images,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Home listed successfully!");
        setTimeout(() => {
          navigate("/host-dashboard");
        }, 1500);
      } else {
        setErrorMessage(result.message || "Failed to list home");
      }
    } catch (error) {
      console.error("Error listing home:", error);
      setErrorMessage("Error listing home. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-5 flex items-center gap-4 border-b-4 border-[#FF385C]">
        <button
          onClick={() => navigate("/host-dashboard")}
          className="flex items-center gap-2 text-[#FF385C] hover:text-[#e0314f] transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-[#FF385C]">List a New Home</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-5 py-10">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Images Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Home Images
              </label>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Home ${idx}`}
                        className="w-full h-28 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Image Upload */}
              <label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF385C] hover:bg-red-50 transition">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Add Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageAdd}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF (Max. 5MB) - Add {images.length === 0 ? "at least 1" : "more"} images
              </p>
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy 2-Bedroom Apartment in Downtown"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your home in detail..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests *
                </label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Night ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Amenities Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Amenities
              </label>

              {/* Amenity Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                  placeholder="e.g., WiFi, Air Conditioning, Kitchen"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-[#FF385C] text-white px-4 py-2 rounded-lg hover:bg-[#e0314f] transition flex items-center gap-2"
                  disabled={loading}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Amenity Tags */}
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FF385C] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="hover:opacity-80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF385C] text-white py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Listing..." : "List Home"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/host-dashboard")}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-gray-500 border-t">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
