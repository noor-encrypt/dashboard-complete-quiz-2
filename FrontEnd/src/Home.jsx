import React, { useEffect, useState } from "react";
import Card from "./Card";
import Banner from "./Banner";

function Home() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await fetch("http://localhost:5000/homes/all-homes");
      const result = await response.json();

      if (result.success && result.homes) {
        setHomes(result.homes);
      } else {
        setError("Failed to load homes");
        // Fall back to default homes if backend fails
        setHomes([]);
      }
    } catch (err) {
      console.error("Error fetching homes:", err);
      setError("Error loading homes. Showing default properties.");
      // Fall back to default homes
      setHomes([]);
    } finally {
      setLoading(false);
    }
  };

  // Default homes if no homes from backend
  const defaultHomes = [
    {
      _id: 1,
      images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      ],
      title: "3 Bedroom Flat in Bournemouth",
      description: "Superhost with a stunning view of the beachside in Sunny Bournemouth",
      price: 130,
      location: "Bournemouth, UK",
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
    },
    {
      _id: 2,
      images: [
        "https://images.unsplash.com/photo-1652400095728-48178d153d85?q=80&w=1299&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      title: "Penthouse in London",
      description: "Enjoy the amazing sights of London with this stunning penthouse",
      price: 350,
      location: "London, UK",
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
    },
    {
      _id: 3,
      images: [
        "https://media.nomadicmatt.com/2018/apartment.jpg",
      ],
      title: "1 Bedroom apartment",
      description: "Superhost with great amenities and a fabulous shopping complex nearby",
      price: 70,
      location: "Manchester, UK",
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
    },
  ];

  const displayHomes = homes && homes.length > 0 ? homes : defaultHomes;

  return (
    <div className="Home">
      <Banner />
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
        </div>
      )}

      {!loading && displayHomes.length > 0 && (
        <>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Homes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayHomes.slice(0, 3).map((home) => (
                <Card
                  key={home._id}
                  src={home.images && home.images.length > 0 ? home.images[0] : "https://via.placeholder.com/500x400"}
                  title={home.title}
                  description={home.description}
                  price={home.price}
                  homeId={home._id}
                  isHome={true}
                />
              ))}
            </div>
          </div>

          {displayHomes.length > 3 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">More Homes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayHomes.slice(3).map((home) => (
                  <Card
                    key={home._id}
                    src={home.images && home.images.length > 0 ? home.images[0] : "https://via.placeholder.com/500x400"}
                    title={home.title}
                    description={home.description}
                    price={home.price}
                    homeId={home._id}
                    isHome={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
