import React from "react";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";

function SearchResult({
  img,
  location,
  title,
  description,
  star,
  price,
  total,
}) {
  return (
    <div className="flex relative m-5 p-5 border-b border-gray-300 cursor-pointer hover:opacity-80 transition duration-200 ease-out">
      {/* Image */}
      <img
        src={img}
        alt={title}
        className="h-[200px] w-[350px] rounded-[10px] overflow-hidden object-cover"
      />

      {/* Heart Icon */}
      <FavouriteBorderIcon className="absolute top-[20px] right-[40px] cursor-pointer text-gray-500" />

      {/* Info */}
      <div className="flex flex-col justify-between pl-5">
        {/* Top Info */}
        <div className="w-[40vw]">
          <p className="text-gray-500 text-[13px] mt-[10px]">{location}</p>
          <h3 className="font-light mt-[10px]">{title}</h3>
          <p className="text-gray-400 mt-[10px]">____</p>
          <p className="text-gray-500 text-[13px] mt-[10px]">{description}</p>
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center mt-5">
          {/* Stars */}
          <div className="flex items-center text-red-500">
            <StarIcon />
            <p>
              <strong>{star}</strong>
            </p>
          </div>

          {/* Price */}
          <div className="absolute bottom-[20px] right-[30px] text-right">
            <h2 className="text-lg font-bold">{price}</h2>
            <p className="text-gray-500 text-sm">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
