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
    <div className="px-[2rem] max-w-[1200px] mx-auto font-[Helvetica Neue,sans-serif]">
      {/* Hero Section */}
      <section className="text-center mb-[3rem] mt-[3rem]">
        <h1 className="text-[2.5rem] mb-[1rem]">Airbnb Services</h1>
        <p className="text-[1.125rem] text-[#555]">
          Book professional services for your stay or home—chefs, spa, trainers, beauty, and more.
        </p>
      </section>

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
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Service Image */}
                <div className="relative overflow-hidden w-full h-56 bg-gray-200">
                  {service.images && service.images.length > 0 ? (
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      src={service.images[0]}
                      alt={service.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-800 truncate">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {service.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-700 mb-3 text-sm">
                    <MapPin size={16} className="text-[#FF385C] flex-shrink-0" />
                    <span className="truncate">{service.location}</span>
                  </div>

                  {/* Amenities Preview */}
                  {service.amenities && service.amenities.length > 0 && (
                    <div className="mb-3 flex gap-2 flex-wrap">
                      {service.amenities.slice(0, 2).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#FFE4E8] text-[#FF385C] px-2 py-1 rounded-full font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {service.amenities.length > 2 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{service.amenities.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer - Price and Host */}
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold text-gray-800">
                        ${service.price}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 text-right max-w-[100px] truncate">
                      {service.hostName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="text-center mt-12 mb-12 py-8">
        <h2 className="text-3xl mb-4 font-bold text-gray-800">Ready to share your services?</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#FF385C] hover:bg-[#e0314f] text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
        >
          Become a Host
        </button>
      </section>
    </div>
  );
};

export default Services;
