import { useNavigate } from "react-router-dom";
import sweeping from "./assets/images/sweeping.jpg";
import chef from "./assets/images/chef services.jpg";
import electrician from "./assets/images/electrician services.jpg";
import photography from "./assets/images/photography.jpg";
import grocery from "./assets/images/grocery.jpg";
import pet from "./assets/images/pet.jpg";

const servicesData = [
  { title: "Chefs", description: "Enjoy in-home meals...", imageUrl: chef },
  { title: "Photography", description: "Personalized photo sessions...", imageUrl: photography },
  { title: "House Cleaning", description: "Professional deep cleaning...", imageUrl: sweeping },
  { title: "Pet Sitting", description: "Trusted sitters...", imageUrl: pet },
  { title: "Grocery Delivery", description: "Fresh groceries delivered...", imageUrl: grocery },
  { title: "Electrician Services", description: "Expert electrical repairs...", imageUrl: electrician },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="px-[2rem] max-w-[1200px] mx-auto font-[Helvetica Neue,sans-serif]">
      {/* Hero Section */}
      <section className="text-center mb-[3rem] mt-[3rem]">
        <h1 className="text-[2.5rem] mb-[1rem]">Airbnb Services</h1>
        <p className="text-[1.125rem] text-[#555]">
          Book professional services for your stay or home—chefs, spa, trainers, beauty, and more.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[2rem]">
        {servicesData.map((service, index) => (
          <div
            key={index}
            onClick={() => navigate(`/services/${index}`, { state: service })}
            className="border border-[#ddd] rounded-[8px] overflow-hidden bg-white transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            <img
              className="w-full h-[200px] object-cover block"
              src={service.imageUrl}
              alt={service.title}
            />
            <div className="p-[1.25rem]">
              <h3 className="mb-[0.75rem] text-[1.25rem]">{service.title}</h3>
              <p className="text-[1rem] text-[#666]">{service.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center mt-[4rem] mb-[4rem]">
        <h2 className="text-[2rem] mb-[1rem]">Ready to book a service?</h2>
        <button className="bg-[#ff385c] hover:bg-[#e33153] text-white border-none px-[1.5rem] py-[0.75rem] text-[1rem] rounded-[4px] cursor-pointer">
          Explore Services
        </button>
      </section>
    </div>
  );
};

export default Services;
