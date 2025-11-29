import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex justify-center items-center px-4 py-16 bg-white">
      <div className="w-full max-w-2xl p-12 bg-white rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Have questions, feedback, or just want to say hello? Fill out the form
          below and we’ll get back to you shortly.
        </p>
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-800">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-800">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-800">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here"
              required
              className="p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 min-h-[150px] resize-y"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-4 !bg-[#ff7779] text-white font-bold text-lg rounded-md hover:bg-pink-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
