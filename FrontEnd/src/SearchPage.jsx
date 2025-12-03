import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SearchResult from "./SearchResult";
import { MapPin, DollarSign, Calendar, Users, Bed } from "lucide-react";

function SearchPage() {
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 0,
    guests: 0,
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetchHomes();
  }, []);

  useEffect(() => {
    if (homes.length > 0) {
      applyFilters();
    }
  }, [homes, filters]);

  const fetchHomes = async () => {
    try {
      const response = await fetch("http://localhost:5000/homes/all-homes");
      const result = await response.json();
      
      console.log("Full response:", result);
      console.log("Homes from backend:", result.homes);

      if (result.success && result.homes && Array.isArray(result.homes)) {
        console.log("Setting homes, count:", result.homes.length);
        setHomes(result.homes);
        setFilteredHomes(result.homes); // Initially show all homes
      } else {
        console.warn("No homes data in response or unexpected format");
        setHomes([]);
        setFilteredHomes([]);
      }
    } catch (err) {
      console.error("Error fetching homes:", err);
      setHomes([]);
      setFilteredHomes([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = homes.filter((home) => {
      const priceMatch =
        home.price >= filters.minPrice && home.price <= filters.maxPrice;
      const bedroomMatch =
        filters.bedrooms === 0 || home.bedrooms >= filters.bedrooms;
      const guestMatch = filters.guests === 0 || home.guests >= filters.guests;
      const locationMatch =
        !filters.location || 
        home.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return priceMatch && bedroomMatch && guestMatch && locationMatch;
    });
    setFilteredHomes(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 0,
      guests: 0,
      checkIn: "",
      checkOut: "",
    });
  };

  const displayResults =
    filteredHomes && filteredHomes.length > 0 ? filteredHomes : [];

  return (
    <div className="searchPage">
      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin size={14} className="inline mr-1" /> Location
            </label>
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign size={14} className="inline mr-1" /> Min Price
            </label>
            <select
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            >
              <option value="0">Any</option>
              <option value="30">$30+</option>
              <option value="50">$50+</option>
              <option value="100">$100+</option>
              <option value="200">$200+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign size={14} className="inline mr-1" /> Max Price
            </label>
            <select
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value) || 10000)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            >
              <option value="10000">Any</option>
              <option value="50">Up to $50</option>
              <option value="100">Up to $100</option>
              <option value="200">Up to $200</option>
              <option value="500">Up to $500</option>
              <option value="1000">Up to $1000</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Bed size={14} className="inline mr-1" /> Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            >
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users size={14} className="inline mr-1" /> Guests
            </label>
            <select
              value={filters.guests}
              onChange={(e) => handleFilterChange("guests", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            >
              <option value="0">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="4">4+</option>
              <option value="6">6+</option>
              <option value="8">8+</option>
            </select>
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="inline mr-1" /> Check-in
            </label>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleFilterChange("checkIn", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="inline mr-1" /> Check-out
            </label>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleFilterChange("checkOut", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
            />
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-[#FF385C] text-white px-4 py-2 rounded font-semibold hover:bg-[#e0314f] transition text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        <p className="mb-[10px] text-[14px]">
          {displayResults.length} homes · Your search
        </p>
        <h1 className="mb-[30px] text-2xl font-semibold">Available Stays</h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          </div>
        )}

        {/* Search Results */}
        {!loading && displayResults.length > 0 ? (
          displayResults.map((result, idx) => (
            <SearchResult
              key={idx}
              img={
                result.images && result.images.length > 0
                  ? result.images[0]
                  : "https://via.placeholder.com/500x400"
              }
              location={result.location}
              title={result.title}
              description={result.description}
              star={4.5}
              price={`£${result.price}/night`}
              total={`£${result.price * 3} total`}
              homeId={result._id}
            />
          ))
        ) : (
          !loading && (
            <div className="p-5 text-center text-gray-600">
              No homes found matching your filters
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchPage;
