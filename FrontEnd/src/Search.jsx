import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import PeopleIcon from "@mui/icons-material/People";
import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function handleSelect(ranges) {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }
  
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white shadow-lg rounded-2xl w-[600px] mx-auto mt-10">
      {/* Calendar */}
      <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />

      {/* Guests */}
      <div className="flex items-center justify-between w-full bg-gray-100 rounded-lg px-4 py-3">
        <span className="font-medium text-gray-700">Number of Guests</span>
        <div className="flex items-center gap-3">
          <input
            min={0}
            defaultValue={2}
            type="number"
            className="w-16 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ff7779]"
          />
          <PeopleIcon className="text-gray-600" />
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={() => navigate("/search")}
        className="!normal-case !bg-[#ff7779] !text-white !w-full !py-3 rounded-lg !font-medium hover:!bg-white hover:!text-[#ff7779] hover:!border hover:!border-[#ff7779]"
      >
        Search Airbnb
      </Button>
    </div>
  );
}

export default Search;
