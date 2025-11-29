import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex items-center justify-between bg-white px-12 py-4 shadow-md sticky top-0 z-50 font-sans">
      {/* Logo */}
      <Link to="/">
        <img
          className="h-20 w-auto"
          src="https://i.pinimg.com/originals/3c/bf/be/3cbfbe148597341fa56f2f87ade90956.png"
          alt="Airbnb Logo"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex gap-8">
        <Link
          to="/home"
          className="text-gray-700 font-medium text-lg px-3 py-2 rounded-full hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 font-medium text-lg px-3 py-2 rounded-full hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition"
        >
          About Us
        </Link>
        <Link
          to="/services"
          className="text-gray-700 font-medium text-lg px-3 py-2 rounded-full hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition"
        >
          Services
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 font-medium text-lg px-3 py-2 rounded-full hover:bg-[#FF385C]/10 hover:text-[#FF385C] transition"
        >
          Contact Us
        </Link>
        
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <p className="font-medium text-gray-700 text-lg hover:text-[#FF385C] cursor-pointer transition">
          Become a host
        </p>

        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition">
          <LanguageIcon className="text-gray-600 text-2xl hover:text-[#FF385C] transition" />
          <KeyboardArrowDownIcon className="text-gray-600 text-2xl hover:text-[#FF385C] transition" />
        </div>

        <Link
          to="/login"
          className="flex items-center gap-2 bg-[#FF385C] text-white px-5 py-2.5 rounded-full shadow-md transform transition hover:bg-[#ff4d6d] hover:shadow-lg hover:scale-105"
        >
          <AccountCircleIcon className="text-2xl" />
          <span className="font-medium">Login</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
