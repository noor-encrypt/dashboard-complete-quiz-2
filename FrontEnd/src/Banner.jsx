import React, { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

function Banner() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="relative h-[65vh] bg-[url('https://media.cntraveler.com/photos/5db1d0dd11c1e500092e7133/master/pass/airbnb-ski-aspen-28328347.jpg')] bg-center bg-cover">
      {/* Search Section */}
      <div className="flex flex-col items-center">
        {showSearch && <Search />}
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="!bg-white !font-black !normal-case !text-[#ff7779] mt-4"
          variant="outlined"
        >
          {showSearch ? "Hide" : "Search Dates"}
        </Button>
      </div>

      {/* Banner Info */}
      <div
        onClick={() => navigate("/search")}
        className="absolute top-0 left-0 bg-black text-white pt-[20vh] px-[60px] pb-[40px] w-[380px] rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold leading-snug">
          Get out and stretch your imagination
        </h1>
        <h5 className="mt-3 text-base leading-relaxed font-light">
          Plan a different kind of getaway to uncover the hidden gems near you.
        </h5>
        <Button
          variant="outlined"
          className="!bg-[#ff7779] pt-3 !text-white !normal-case mt-6 !font-semibold hover:!bg-white hover:!text-[#ff7779] transition"
        >
          Explore Nearby
        </Button>
      </div>
    </div>
  );
}

export default Banner;
