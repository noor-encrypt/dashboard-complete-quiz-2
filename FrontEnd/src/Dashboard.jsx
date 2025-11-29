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
} from "lucide-react";

export default function Dashboard() {
  const [userEmail, setuserEmail] = useState("");
  const [userName, setuserName] = useState("");
 
const getDataFromApi = async (token) => {
  try {
    const myEndpoint = "http://localhost:5000/user/get-profile/";
    const response = await fetch(myEndpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const parsedData = await response.json();
    // console.log("parsed received Data:", parsedData);

    if (parsedData.message !== "OK" || !parsedData.userData) {
      alert("Session expired or invalid token.");
      localStorage.removeItem("userToken");
      window.location.replace("/login");
      return;
    }

    setuserEmail(parsedData.userData.regEmail);
    setuserName(parsedData.userData.regName);
  } catch (error) {
    console.error("Error fetching profile:", error);
    alert("Error fetching user data. Please login again.");
    localStorage.removeItem("userToken");
    window.location.replace("/login");
  }
};

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    //console.log("token from browser: ", token)
    if (!token) {
      alert("Please register or login first!");
      window.location.replace("/login/");
    }else{
      //console.log("token exists...");
      getDataFromApi(token);
    }
  }, []);
 
  // Logout function
  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("userToken");
 
    // Redirect to login/register page and reload (fresh page)
    window.location.replace("/login"); // or "/login"
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm p-5 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-[#FF385C] tracking-tight">
          Airbnb Dashboard
        </h1>
        <button
          className="flex items-center gap-2 bg-[#FF385C] text-white px-4 py-2 rounded-full hover:bg-[#e0314f] transition"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-12">
          Welcome back,{" "}
          <span className="text-[#FF385C]">{userName || "User"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-11/12 max-w-6xl">
          {/* Home */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <Home className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">Home</h3>
            <p className="text-gray-500 mt-2 mb-4">Go to the main homepage.</p>
            <Link
              to="/"
              className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition"
            >
              Visit
            </Link>
          </div>

          {/* Services */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <BedDouble className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">Our Services</h3>
            <p className="text-gray-500 mt-2 mb-4">Explore all booking services.</p>
            <Link
              to="/services"
              className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition"
            >
              View
            </Link>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <ClipboardList className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">Bookings</h3>
            <p className="text-gray-500 mt-2 mb-4">Check and manage your bookings.</p>
            <button className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition">
              Manage
            </button>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <Info className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">About Us</h3>
            <p className="text-gray-500 mt-2 mb-4">Learn about this platform.</p>
            <Link
              to="/about"
              className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition"
            >
              Learn
            </Link>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <Phone className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">Contact Us</h3>
            <p className="text-gray-500 mt-2 mb-4">Reach out for help or feedback.</p>
            <Link
              to="/contact"
              className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition"
            >
              Contact
            </Link>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition">
            <User className="mx-auto text-[#FF385C]" size={42} />
            <h3 className="text-xl font-semibold mt-4">Profile</h3>
            <p className="text-gray-500 mt-2 mb-4">Edit account info and preferences.</p>
            <button className="bg-[#FF385C] text-white px-5 py-2 rounded-full hover:bg-[#e0314f] transition">
              Edit
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 mt-16 text-gray-500 border-t">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
