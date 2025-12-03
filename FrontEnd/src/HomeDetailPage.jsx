// HomeDetailPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Users, Bed, Bath, Heart, Share2, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BookingModal from "./BookingModal";

export default function HomeDetailPage() {
  const navigate = useNavigate();
  const { homeId } = useParams();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchHomeDetails();
  }, [homeId]);

  const fetchHomeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/homes/home/${homeId}`);
      const result = await response.json();

      if (result.success) {
        setHome(result.data);
      } else {
        setError("Home not found");
      }
    } catch (err) {
      console.error("Error fetching home details:", err);
      setError("Error loading home details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? home.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === home.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF385C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading home details...</p>
        </div>
      </div>
    );
  }

  if (error || !home) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#e0314f] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-5 flex items-center justify-between border-b-4 border-[#FF385C] sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#FF385C] hover:text-[#e0314f] transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Share"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Save"
          >
            <Heart
              size={20}
              className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-600"}
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video">
                <img
                  src={home.images[selectedImageIndex]}
                  alt={`Home ${selectedImageIndex}`}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {home.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {home.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {home.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {home.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-[#FF385C]"
                          : "border-gray-300 hover:border-[#FF385C]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Home Title and Basic Info */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {home.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#FF385C]" />
                  {home.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#FF385C]" />
                  {home.guests} Guests
                </div>
              </div>

              <p className="text-gray-700 text-base leading-relaxed">
                {home.description}
              </p>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Property Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Bed size={28} className="text-[#FF385C]" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {home.bedrooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bath size={28} className="text-[#FF385C]" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {home.bathrooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users size={28} className="text-[#FF385C]" />
                  <div>
                    <p className="text-sm text-gray-600">Max Guests</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {home.guests}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {home.amenities && home.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {home.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FF385C] bg-opacity-10 text-[#FF385C] px-4 py-2 rounded-full font-medium"
                    >
                      ✓ {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Info */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Meet Your Host
              </h2>
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {home.hostName}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Host since {new Date(home.createdAt).getFullYear()}
                  </p>
                  <p className="text-gray-700 mb-4">
                    Contact the host to learn more about this property.
                  </p>

                  <div className="flex flex-col gap-2">
                    {home.hostEmail && (
                      <a
                        href={`mailto:${home.hostEmail}`}
                        className="flex items-center gap-2 text-[#FF385C] hover:underline"
                      >
                        <Mail size={16} />
                        {home.hostEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 space-y-4">
              {/* Price Section */}
              <div className="border-b pb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-800">
                    ${home.price}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>
                {home.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★ {home.rating}</span>
                    <span className="text-gray-600">({home.reviews ? home.reviews.length : 0} reviews)</span>
                  </div>
                )}
              </div>

              {/* Check-in / Check-out (Placeholder) */}
              <div className="space-y-3">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent text-sm"
                  placeholder="Check-in date"
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent text-sm"
                  placeholder="Check-out date"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">${home.price} × 1 night</span>
                  <span className="text-gray-800 font-semibold">${home.price}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${home.price}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#e0314f] transition"
              >
                Reserve
              </button>

              <p className="text-center text-xs text-gray-600">
                You won't be charged yet
              </p>

              {/* Additional Actions */}
              <div className="border-t pt-4 space-y-2">
                <button className="w-full text-[#FF385C] py-2 rounded-lg border border-[#FF385C] hover:bg-red-50 transition font-medium text-sm">
                  Report Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-gray-500 border-t mt-12">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          property={home} 
          propertyType="home"
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate("/my-bookings");
          }}
        />
      )}
    </div>
  );
}

