// ResetPassword.jsx
import React, { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword({ onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleResetPassword = async (e) => {
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
    if (
      !formData.oldPassword.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setErrorMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/user/update-user/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Password reset successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage(result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Old Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.oldPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.newPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                Password strength:{" "}
                <span
                  className={
                    formData.newPassword.length >= 8
                      ? "text-green-600 font-semibold"
                      : "text-orange-600 font-semibold"
                  }
                >
                  {formData.newPassword.length >= 8
                    ? "Strong"
                    : "Moderate"}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your password will be updated immediately.
          </p>
        </div>
      </div>
    </>
  );
}
