// ServiceDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Home,
  User,
  Mail,
  Image,
  Heart,
  Share2,
} from "lucide-react";

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/services/service/${serviceId}`
        );
        const result = await response.json();

        if (result.success) {
          setService(result.service);
        } else {
          alert("Service not found");
          navigate("/services");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        alert("Error loading service");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF385C] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-5 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-[#FF385C] hover:text-[#e0314f] transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-[#FF385C] flex-grow">{service.title}</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            {service.images && service.images.length > 0 ? (
              <>
                <img
                  src={service.images[mainImage]}
                  alt={service.title}
                  className="w-full h-96 object-cover rounded-lg border-4 border-white shadow-lg"
                />
                {service.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {service.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMainImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          mainImage === idx
                            ? "border-[#FF385C]"
                            : "border-gray-300 hover:border-gray-400"
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
              </>
            ) : (
              <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <Image size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-20">
            <div className="mb-6">
              <p className="text-sm text-gray-600">Price per night</p>
              <p className="text-4xl font-bold text-[#FF385C]">
                ${service.price.toFixed(2)}
              </p>
            </div>

            <button className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#e0314f] transition mb-3">
              Book Now
            </button>

            <button className="w-full border-2 border-[#FF385C] text-[#FF385C] py-3 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2 mb-3">
              <Heart size={18} /> Save
            </button>

            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Share2 size={18} /> Share
            </button>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">Host Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">4.8</span>
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {service.title}
              </h2>
              <p className="text-gray-600 text-lg mb-4">{service.description}</p>

              <div className="flex items-center gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-[#FF385C]" />
                  <span>{service.location}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {service.amenities && service.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  What's included
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-[#FF385C] rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                About this service
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Right Column - Host Info */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Meet your host
              </h3>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF385C] to-[#e0314f] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {service.hostName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{service.hostName}</p>
                  <p className="text-sm text-gray-600">Host</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <p className="text-sm break-words">{service.hostId}</p>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Home size={18} className="text-gray-400" />
                  <p className="text-sm">Verified Host</p>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <User size={18} className="text-gray-400" />
                  <p className="text-sm">Member since 2024</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-white border-2 border-[#FF385C] text-[#FF385C] py-2 rounded-lg font-semibold hover:bg-red-50 transition">
                Contact Host
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Reviews from guests
          </h3>
          <p className="text-gray-600 text-center py-8">
            No reviews yet. Be the first to review this service!
          </p>
        </div>
      </div>
    </div>
  );
}
