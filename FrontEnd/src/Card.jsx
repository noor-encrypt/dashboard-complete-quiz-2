import React from "react";

function Card({ src, title, description, price }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition ease-in duration-100 cursor-pointer flex flex-col bg-white">
      <img
        src={src}
        alt={title}
        className="object-cover w-full h-56"
      />
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <h4 className="text-sm font-light mt-2 mb-2 line-clamp-3">{description}</h4>
        </div>
        <h3 className="text-base font-medium text-pink-600">{price}</h3>
      </div>
    </div>
  );
}
export default Card;
