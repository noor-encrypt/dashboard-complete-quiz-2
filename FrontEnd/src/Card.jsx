import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";

function Card({ src, title, description, price, homeId, isHome = false }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleClick = () => {
    if (isHome && homeId) {
      navigate(`/home-detail/${homeId}`);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 flex flex-col bg-white group ${
        isHome ? "cursor-pointer hover:-translate-y-2" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img
          src={src}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition shadow-lg"
        >
          <Heart
            size={20}
            className={isFavorite ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-400"}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#FF385C] transition">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#FF385C]">${price}</span>
            <span className="text-gray-600 text-sm">/ night</span>
          </div>
          <span className="text-xs font-semibold bg-[#FFE4E8] text-[#FF385C] px-2 py-1 rounded-full">
            Available
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
