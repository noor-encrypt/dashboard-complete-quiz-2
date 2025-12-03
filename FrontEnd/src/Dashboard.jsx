// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BedDouble,
  ClipboardList,
  User,
  Info,
  Phone,
  LogOut,
  Edit3,
  Lock,
  Store,
  Crown,
} from "lucide-react";
import ResetPassword from "./ResetPassword";

export default function Dashboard() {
  const [userEmail, setuserEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Delete Account
  const handleDelete = async () => {
    const token = localStorage.getItem("userToken");

    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/delete-user", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      const result = await response.json();

      if (result.success) {
        alert("Account deleted successfully.");
        localStorage.removeItem("userToken");
        window.location.replace("/login");
      } else {
        alert(result.message || "Unable to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    }
  };

  // Fetch Profile Data
  const getDataFromApi = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/user/get-profile/",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const parsedData = await response.json();

      if (parsedData.message !== "OK" || !parsedData.userData) {
        alert("Session expired or invalid token.");
        localStorage.removeItem("userToken");
        window.location.replace("/login");
        return;
      }

      setuserEmail(parsedData.userData.regEmail);
      setuserName(parsedData.userData.regName);
      // Ensure isHost is properly set as boolean
      const hostStatus = parsedData.userData.isHost === true || parsedData.userData.isHost === "true";
      setIsHost(hostStatus);
      if (parsedData.userData.profilePic) {
        setProfilePic(parsedData.userData.profilePic);
      }
    } catch (error) {
      alert("Error fetching profile. Please login again.");
      localStorage.removeItem("userToken");
      window.location.replace("/login");
    }
  };

  // On Load
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please register or login first!");
      window.location.replace("/login/");
    } else {
      getDataFromApi(token);
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.replace("/login");
  };

  // Become Host
  const handleBecomeHost = async () => {
    const token = localStorage.getItem("userToken");

    if (!window.confirm("Are you sure you want to become a host?")) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/services/become-host",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Congratulations! You are now a host!");
        // Refresh profile data to ensure isHost is updated
        setIsHost(true);
        // Optionally fetch fresh data from backend
        getDataFromApi(token);
      } else {
        alert(result.message || "Failed to become a host");
      }
    } catch (error) {
      console.error("Error becoming host:", error);
      alert("Error becoming host. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md p-5 flex justify-between items-center border-b-4 border-[#FF385C]">
        <h1 className="text-2xl font-bold text-[#FF385C]">Airbnb Dashboard</h1>

        <button
          className="flex items-center gap-2 bg-[#FF385C] text-white px-4 py-2 rounded-full hover:bg-[#e0314f] transition transform hover:scale-105"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center py-10 px-4">
        {/* Welcome Section with Profile Card */}
        <div className="w-full max-w-6xl mb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="bg-gradient-to-r from-[#FF385C] to-[#e0314f] p-8 text-white flex items-center gap-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-full overflow-hidden w-20 h-20 flex-shrink-0 flex items-center justify-center">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm opacity-90">Welcome back,</p>
                <h2 className="text-3xl font-bold">{userName || "User"}</h2>
                <p className="text-sm opacity-90 mt-1">{userEmail}</p>
              </div>
            </div>
            
            <div className="p-8 bg-gray-50">
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-full hover:bg-[#e0314f] transition transform hover:scale-105 font-semibold"
                >
                  <Edit3 size={18} /> Edit Profile
                </Link>

                <button
                  onClick={() => setShowResetPassword(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-105 font-semibold"
                >
                  <Lock size={18} /> Reset Password
                </button>

                {isHost ? (
                  <Link
                    to="/host-dashboard"
                    className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition transform hover:scale-105 font-semibold"
                  >
                    <Store size={18} /> Manage Services
                  </Link>
                ) : (
                  <button
                    onClick={handleBecomeHost}
                    className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition transform hover:scale-105 font-semibold"
                  >
                    <Crown size={18} /> Become a Host
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition transform hover:scale-105 font-semibold ml-auto"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="w-full max-w-6xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Home */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition transform">
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 p-4 rounded-full">
                  <Home className="text-[#FF385C]" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Home</h3>
              <p className="text-gray-500 mt-2 mb-4">Go to homepage.</p>
              <Link
                to="/"
                className="inline-block bg-[#FF385C] text-white px-6 py-2 rounded-full hover:bg-[#e0314f] transition font-semibold"
              >
                Visit
              </Link>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition transform">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <BedDouble className="text-blue-500" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Our Services</h3>
              <p className="text-gray-500 mt-2 mb-4">Explore booking services.</p>
              <Link
                to="/services"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition font-semibold"
              >
                View
              </Link>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition transform">
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 p-4 rounded-full">
                  <ClipboardList className="text-green-500" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Bookings</h3>
              <p className="text-gray-500 mt-2 mb-4">Manage your bookings.</p>
              <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition font-semibold">
                Manage
              </button>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition transform">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-50 p-4 rounded-full">
                  <Info className="text-purple-500" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">About Us</h3>
              <p className="text-gray-500 mt-2 mb-4">Learn about us.</p>
              <Link
                to="/about"
                className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition font-semibold"
              >
                Learn
              </Link>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition transform">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-50 p-4 rounded-full">
                  <Phone className="text-orange-500" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Contact Us</h3>
              <p className="text-gray-500 mt-2 mb-4">Reach out for support.</p>
              <Link
                to="/contact"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition font-semibold"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Reset Password Modal */}
      {showResetPassword && (
        <ResetPassword onClose={() => setShowResetPassword(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white text-center py-6 mt-16 text-gray-500 border-t-2 border-gray-200">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
