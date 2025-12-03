// EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    regName: "",
    regEmail: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/user/get-profile/",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const parsedData = await response.json();

        if (parsedData.message !== "OK" || !parsedData.userData) {
          alert("Session expired or invalid token.");
          localStorage.removeItem("userToken");
          navigate("/login");
          return;
        }

        setFormData({
          regName: parsedData.userData.regName,
          regEmail: parsedData.userData.regEmail,
        });

        if (parsedData.userData.profilePic) {
          setPreviewPic(parsedData.userData.profilePic);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Error loading profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setPreviewPic(reader.result);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const handleRemoveImage = () => {
    setProfilePic(null);
    setPreviewPic(null);
    setErrorMessage("");
  };

  // Handle form submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("userToken");

    if (!token) {
      setErrorMessage("Token not found. Please login again.");
      setLoading(false);
      return;
    }

    // Validate fields
    if (!formData.regName.trim() || !formData.regEmail.trim()) {
      setErrorMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // First, update profile info
      const response = await fetch("http://localhost:5000/user/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        setErrorMessage(result.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      // If image was changed, upload it
      if (profilePic) {
        const imageResponse = await fetch(
          "http://localhost:5000/user/update-user/upload-pic",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profilePic: profilePic }),
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResult.success) {
          setErrorMessage("Profile updated but image upload failed");
          setLoading(false);
          return;
        }
      }

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-5 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[#FF385C] hover:text-[#e0314f] transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-[#FF385C]">Edit Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              
              {/* Image Preview */}
              {previewPic && (
                <div className="relative inline-block w-full">
                  <img
                    src={previewPic}
                    alt="Profile preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Image Upload */}
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF385C] hover:bg-red-50 transition">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {previewPic ? "Change Photo" : "Upload Photo"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF (Max. 5MB)
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="regName"
                value={formData.regName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="regEmail"
                value={formData.regEmail}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF385C] text-white py-2 rounded-lg font-semibold hover:bg-[#e0314f] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-gray-500 border-t">
        © {new Date().getFullYear()} Airbnb Clone | All Rights Reserved
      </footer>
    </div>
  );
}
