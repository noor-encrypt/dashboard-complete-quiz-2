import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SearchResult from "./SearchResult";

function SearchPage() {
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    bedrooms: 0,
    guests: 0,
  });

  useEffect(() => {
    fetchHomes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [homes, filters]);

  const fetchHomes = async () => {
    try {
      const response = await fetch("http://localhost:5000/homes/all-homes");
      const result = await response.json();

      if (result.success && result.homes) {
        setHomes(result.homes);
        setFilteredHomes(result.homes);
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
      return priceMatch && bedroomMatch && guestMatch;
    });
    setFilteredHomes(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const defaultResults = [
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
      location: "Private room in center of London",
      title: "Stay at this spacious Edwardian House",
      description: "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
      star: 4.73,
      price: "£30 / night",
      total: "£117 total",
    },
    {
      img: "https://a0.muscache.com/im/pictures/15159c9c-9cf1-400e-b809-4e13f286fa38.jpg?im_w=720",
      location: "Private room in center of London",
      title: "Independant luxury studio apartment",
      description: "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
      star: 4.3,
      price: "£40 / night",
      total: "£157 total",
    },
    {
      img: "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
      location: "Private room in center of London",
      title: "London Studio Apartments",
      description: "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
      star: 3.8,
      price: "£35 / night",
      total: "£207 total",
    },
  ];

  const displayResults =
    filteredHomes && filteredHomes.length > 0 ? filteredHomes : defaultResults;

  return (
    <div className="searchPage">
      {/* Info Section */}
      <div className="p-5">
        <p className="mb-[10px] text-[14px]">
          {displayResults.length} homes · Your destination
        </p>
        <h1 className="mb-[30px] text-2xl font-semibold">Stays nearby</h1>

        {/* Filter Buttons */}
        <div className="mb-5 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <select
              onChange={(e) =>
                handleFilterChange("minPrice", parseInt(e.target.value) || 0)
              }
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="0">Min Price: Any</option>
              <option value="30">Min: £30</option>
              <option value="50">Min: £50</option>
              <option value="100">Min: £100</option>
            </select>

            <select
              onChange={(e) =>
                handleFilterChange("maxPrice", parseInt(e.target.value) || 1000)
              }
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="1000">Max Price: Any</option>
              <option value="50">Max: £50</option>
              <option value="100">Max: £100</option>
              <option value="200">Max: £200</option>
            </select>

            <select
              onChange={(e) =>
                handleFilterChange("bedrooms", parseInt(e.target.value) || 0)
              }
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="0">Bedrooms: Any</option>
              <option value="1">Min: 1 Bedroom</option>
              <option value="2">Min: 2 Bedrooms</option>
              <option value="3">Min: 3 Bedrooms</option>
            </select>

            <select
              onChange={(e) =>
                handleFilterChange("guests", parseInt(e.target.value) || 0)
              }
              className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
            >
              <option value="0">Guests: Any</option>
              <option value="1">1+ Guests</option>
              <option value="2">2+ Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>
        </div>
      </div>

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
                : result.img
            }
            location={result.location || `${result.location || "London, UK"}`}
            title={result.title}
            description={
              result.description ||
              `${result.bedrooms} bedrooms · ${result.bathrooms} bathrooms · ${result.guests} guests`
            }
            star={result.star || 4.5}
            price={result.price || `£${result.price}/night`}
            total={result.total || `£${result.price * 3} total`}
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
  );
}
