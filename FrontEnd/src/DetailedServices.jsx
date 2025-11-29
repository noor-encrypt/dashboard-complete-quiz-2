import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ServiceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state;

  if (!service) return <p>Service not found.</p>;

  return (
    <div className="px-[2rem] max-w-[900px] mx-auto py-[3rem]">
      <button
        onClick={() => navigate(-1)}
        className="mb-[2rem] text-[#ff385c] font-semibold"
      >
        ← Back to Services
      </button>

      <h1 className="text-[2.5rem] mb-[1rem]">{service.title}</h1>
      <p className="text-[1.125rem] text-[#555] mb-[2rem]">{service.description}</p>
      <img
        src={service.imageUrl}
        alt={service.title}
        className="w-full h-[400px] object-cover rounded-[8px] mb-[2rem]"
      />

      <section className="mb-[2rem]">
        <h2 className="text-[2rem] mb-[1rem]">Service Details</h2>
        <p className="text-[#555] text-[1rem]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Professional and trusted {service.title.toLowerCase()} services for your convenience.
        </p>
      </section>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#ff385c", ":hover": { backgroundColor: "#e33153" }, textTransform: "none", borderRadius: "4px" }}
      >
        Book This Service
      </Button>
    </div>
  );
};

export default ServiceDetail;
