import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import SearchPage from "./SearchPage";
import Services from "./Services";
import ServiceDetailPage from "./ServiceDetailPage";
import ContactUs from "./ContactUs";
import LoginPage from "./LoginPage";
import About from "./About";
import Dashboard from "./Dashboard";
import SignupPage from "./SignUp";
import EditProfile from "./EditProfile";
import HostDashboard from "./HostDashboard";
import AddService from "./AddService";
import AddHome from "./AddHome";
import HomeDetailPage from "./HomeDetailPage";
import ServiceDetail from "./DetailedServices"; // adjust path if needed


// ✅ Wrapper component to access location
function AppWrapper() {
  const location = useLocation();

  // Paths where we DON'T want Header/Footer
  const hideHeaderFooter = ["/login", "/dashboard", "/signup", "/edit-profile", "/host-dashboard", "/add-service", "/add-home", "/service-detail", "/home-detail"];

  const hideLayout = hideHeaderFooter.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<SearchPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service-detail/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/add-home" element={<AddHome />} />
        <Route path="/home-detail/:homeId" element={<HomeDetailPage />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
