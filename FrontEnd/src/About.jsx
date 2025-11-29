// src/About.jsx
import React from "react";

export default function About() {
  return (
    <main className="bg-white text-gray-800 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fff8f8] via-[#fff5f7] to-[#ffffff] py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-[#FF385C] mb-6 drop-shadow-sm">About Airbnb</h1>
          <p className="text-lg leading-relaxed text-gray-700 max-w-2xl mx-auto mb-8">
            At Airbnb, we believe travel should feel like home — simple, warm, and memorable.
            Whether you’re exploring new destinations or welcoming guests, we make every stay meaningful and personal.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("our-story");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-block bg-[#FF385C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e03150] transition"
          >
            Explore Our Journey
          </button>
        </div>
      </section>

      {/* Our Story */}
      <section id="our-story" className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            Founded with the idea that everyone deserves a welcoming space, Airbnb connects travelers
            and hosts through a community built on trust and simplicity. From small apartments to cozy
            cabins, every listing offers an experience designed with care.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Our team is passionate about creating memories — where comfort meets authenticity, and where
            every guest feels at home no matter where they are in the world.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Airbnb homes"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* What We Value */}
      <section className="bg-gray-50 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">What We Value</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 px-6">
          <div className="bg-white rounded-3xl shadow-md p-8 hover:-translate-y-2 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#FF385C] mb-2">Comfort</h3>
            <p className="text-gray-600 text-sm">
              Spaces designed with warmth and care to make you feel at home wherever you go.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-md p-8 hover:-translate-y-2 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#FF385C] mb-2">Trust</h3>
            <p className="text-gray-600 text-sm">
              Clear communication, verified hosts, and secure bookings — because peace of mind matters.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-md p-8 hover:-translate-y-2 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#FF385C] mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              A global network of hosts and guests who value kindness, respect, and belonging.
            </p>
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-24 text-center bg-gradient-to-br from-[#fff5f7] to-[#ffeef1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            To make every trip meaningful — one stay at a time. Airbnb empowers travelers and hosts
            to create connections that go beyond walls, turning every visit into a story worth sharing.
          </p>
          <a
            href="/services"
            className="inline-block bg-[#FF385C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e03150] transition"
          >
            Discover Our Services
          </a>
        </div>
      </section>
    </main>
  );
}
