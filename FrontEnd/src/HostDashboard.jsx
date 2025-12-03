// HostDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  LogOut,
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  Home,
  Briefcase,
} from "lucide-react";

export default function HostDashboard() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [homes, setHomes] = useState([]);
  const [activeTab, setActiveTab] = useState("services");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch profile, services, and homes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      try {
        // Get profile
        const profileResponse = await fetch(
          "http://localhost:5000/user/get-profile/",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileData = await profileResponse.json();

        if (profileData.message !== "OK" || !profileData.userData) {
          alert("Session expired or invalid token.");
          localStorage.removeItem("userToken");
          navigate("/login");
          return;
        }

        setUserName(profileData.userData.regName);
        setUserEmail(profileData.userData.regEmail);
        setIsHost(profileData.userData.isHost);

        if (!profileData.userData.isHost) {
          setErrorMessage("You need to become a host first");
          setLoading(false);
          return;
        }

        // Get services
        const servicesResponse = await fetch(
          "http://localhost:5000/services/my-services",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const servicesData = await servicesResponse.json();
        if (servicesData.success) {
          setServices(servicesData.services);
        }

        // Get homes
        const homesResponse = await fetch(
          "http://localhost:5000/homes/my-homes",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const homesData = await homesResponse.json();
        if (homesData.success) {
          setHomes(homesData.homes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error loading data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/services/delete-service/${serviceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success) {
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
        alert("Service deleted successfully!");
      } else {
        alert(result.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const handleDeleteHome = async (homeId) => {
    if (!window.confirm("Are you sure you want to delete this home?")) {
      return;
    }

    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/homes/delete-home/${homeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.success) {
        setHomes((prev) => prev.filter((h) => h._id !== homeId));
        alert("Home deleted successfully!");
      } else {
        alert(result.message || "Failed to delete home");
      }
    } catch (error) {
      console.error("Error deleting home:", error);
      alert("Error deleting home");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF385C] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-md p-5 flex justify-between items-center border-b-4 border-[#FF385C]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#FF385C] hover:text-[#e0314f] transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[#FF385C]">Host Dashboard</h1>
        </div>

        <button
          className="flex items-center gap-2 bg-[#FF385C] text-white px-4 py-2 rounded-full hover:bg-[#e0314f] transition"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {userName}!
            </h2>
            <p className="text-gray-600 mb-4">{userEmail}</p>
            <p className="text-gray-600">
              You have <span className="font-bold text-[#FF385C]">{services.length}</span> service{services.length !== 1 ? "s" : ""} and{" "}
              <span className="font-bold text-[#FF385C]">{homes.length}</span> home{homes.length !== 1 ? "s" : ""} listed.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              {errorMessage}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-2 pb-3 px-4 font-semibold transition ${
                activeTab === "services"
                  ? "text-[#FF385C] border-b-2 border-[#FF385C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Briefcase size={18} />
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("homes")}
              className={`flex items-center gap-2 pb-3 px-4 font-semibold transition ${
                activeTab === "homes"
                  ? "text-[#FF385C] border-b-2 border-[#FF385C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Home size={18} />
              Homes ({homes.length})
            </button>
          </div>

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              {/* Add Service Button */}
              <div className="mb-8">
                <Link
                  to="/add-service"
                  className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e0314f] transition transform hover:scale-105"
                >
                  <Plus size={20} /> Add New Service
                </Link>
              </div>

              {/* Services Grid */}
              {services.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
                    <Briefcase size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Services Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by creating your first service listing!
                  </p>
                  <Link
                    to="/add-service"
                    className="inline-block bg-[#FF385C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition"
                  >
                    Create First Service
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      {/* Service Image */}
                      {service.images && service.images.length > 0 && (
                        <img
                          src={service.images[0]}
                          alt={service.title}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      {/* Service Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                          {service.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Location and Price */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={16} className="text-[#FF385C]" />
                            <span className="text-sm">{service.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="font-semibold">${service.price}/night</span>
                          </div>
                        </div>

                        {/* Amenities Preview */}
                        {service.amenities && service.amenities.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1">
                            {service.amenities.slice(0, 2).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                            {service.amenities.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{service.amenities.length - 2} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Link
                            to={`/edit-service/${service._id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
                          >
                            <Edit3 size={16} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Homes Tab */}
          {activeTab === "homes" && (
            <div>
              {/* Add Home Button */}
              <div className="mb-8">
                <Link
                  to="/add-home"
                  className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e0314f] transition transform hover:scale-105"
                >
                  <Plus size={20} /> List New Home
                </Link>
              </div>

              {/* Homes Grid */}
              {homes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
                    <Home size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Homes Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by listing your first home!
                  </p>
                  <Link
                    to="/add-home"
                    className="inline-block bg-[#FF385C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition"
                  >
                    List First Home
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homes.map((home) => (
                    <div
                      key={home._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      {/* Home Image */}
                      {home.images && home.images.length > 0 && (
                        <img
                          src={home.images[0]}
                          alt={home.title}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      {/* Home Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                          {home.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {home.description}
                        </p>

                        {/* Location and Price */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={16} className="text-[#FF385C]" />
                            <span className="text-sm">{home.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="font-semibold">${home.price}/night</span>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="mb-4 flex gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} /> {home.bedrooms} Bed
                          </span>
                          <span className="flex items-center gap-1">
                            <Home size={14} /> {home.bathrooms} Bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={14} /> {home.guests} Guest
                          </span>
                        </div>

                        {/* Amenities Preview */}
                        {home.amenities && home.amenities.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1">
                            {home.amenities.slice(0, 2).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                            {home.amenities.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{home.amenities.length - 2} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Link
                            to={`/home-detail/${home._id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteHome(home._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-6 text-gray-500 border-t-2 border-gray-200">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
