import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Loader } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default services fallback
  const defaultServices = [
    {
      _id: 1,
      title: "Professional Chef Service",
      description: "Personal chef for special dinners and culinary experiences",
      price: 150,
      location: "London, UK",
      hostName: "Chef Emma",
      images: ["https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop"],
      amenities: ["Experienced", "Flexible Menu"]
    },
    {
      _id: 2,
      title: "Spa & Wellness Treatment",
      description: "Relaxing spa services including massage and beauty treatments",
      price: 120,
      location: "Manchester, UK",
      hostName: "Spa Therapist Sarah",
      images: ["https://images.unsplash.com/photo-1544161515-81205f8abedf?w=500&h=300&fit=crop"],
      amenities: ["Certified", "Mobile Service"]
    },
    {
      _id: 3,
      title: "Personal Training Sessions",
      description: "One-on-one fitness coaching and personalized workout plans",
      price: 80,
      location: "Liverpool, UK",
      hostName: "Trainer James",
      images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop"],
      amenities: ["Professional", "Home Service"]
    },
    {
      _id: 4,
      title: "Professional Photography",
      description: "Event photography and portrait sessions for your special moments",
      price: 200,
      location: "Birmingham, UK",
      hostName: "Photographer Mike",
      images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop"],
      amenities: ["High Quality", "Same Day Editing"]
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/services/all-services"
        );
        const result = await response.json();

        if (result.success && result.services.length > 0) {
          setServices(result.services);
        } else {
          // Use default services if no services from backend
          setServices(defaultServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        // Use default services on error
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-[Helvetica Neue,sans-serif]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF385C] via-[#FF4D6D] to-[#FF385C] py-16 px-6 text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          🎯 Professional Services
        </h1>
        <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto drop-shadow">
          Book expert services from verified professionals—photography, cooking, training, and more
        </p>
      </section>

      <div className="px-[2rem] max-w-[1200px] mx-auto">

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF385C] border-t-transparent"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-[1.125rem] text-[#555] mb-4">
            No services available yet
          </p>
          <p className="text-[#999]">Check back soon or become a host to list your services!</p>
        </div>
      ) : (
        <>
          {/* Services Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => navigate(`/service-detail/${service._id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border border-gray-100 group"
              >
                {/* Service Image Container */}
                <div className="relative overflow-hidden w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300">
                  {service.images && service.images.length > 0 ? (
                    <div className="relative h-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={service.images[0]}
                        alt={service.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-500">
                      <span className="text-center">
                        <p className="text-2xl mb-2">📷</p>
                        No image
                      </span>
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-[#FF385C] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ${service.price}
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-gray-800 truncate group-hover:text-[#FF385C] transition">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {service.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-700 mb-3 text-sm">
                    <span className="text-lg">📍</span>
                    <span className="truncate">{service.location}</span>
                  </div>

                  {/* Amenities Preview */}
                  {service.amenities && service.amenities.length > 0 && (
                    <div className="mb-4 flex gap-2 flex-wrap">
                      {service.amenities.slice(0, 2).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gradient-to-r from-[#FFE4E8] to-[#FFD0D8] text-[#FF385C] px-2.5 py-1 rounded-full font-semibold"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                      {service.amenities.length > 2 && (
                        <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                          +{service.amenities.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer - Host */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">by</p>
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#FF385C] transition">
                      {service.hostName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
      </div>

      {/* CTA Section */}
      <section className="text-center mt-16 mb-16 py-12 bg-gradient-to-r from-[#FF385C] to-[#FF4D6D] rounded-2xl mx-6">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to share your services?</h2>
        <p className="text-lg text-white text-opacity-90 mb-6">Become a host and start earning today</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-[#FF385C] hover:bg-gray-100 text-lg px-8 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
        >
          Become a Host →
        </button>
      </section>
    </div>
  );
};

export default Services;
