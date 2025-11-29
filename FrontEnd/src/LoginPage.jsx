import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // inside LoginPage.jsx (replace your handleLogin)
const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  if (!email || !password) {
    setErrorMsg("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/user/login-user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regEmail: email, password: password }),
    });

    // Useful debugging info:
    console.log("HTTP status:", response.status, response.statusText);

    // Try to parse JSON safely. If backend returns non-JSON, we capture text:
    let data;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      console.warn("Response is not valid JSON:", text);
      throw new Error("Server returned non-JSON response. See console.");
    }

    console.log("Parsed login response:", data);

    if (response.ok && data.token) {
      localStorage.setItem("userToken", data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      // Prefer backend message. If not present, show status text.
      const message = data.message || data.error || `Login failed (status ${response.status})`;
      setErrorMsg(message);
    }
  } catch (err) {
    console.error("Login error (caught):", err);
    setErrorMsg(err.message || "Something went wrong. Please try again.");
  }
};


  return (
    <div className="flex justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-200 min-h-[calc(100vh-80px)]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Log in to Airbnb
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />

          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 shadow-md transition duration-200"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-gray-50 py-3 rounded-xl hover:bg-white transition font-medium">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-gray-50 py-3 rounded-xl mt-3 hover:bg-white transition font-medium">
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            alt="Facebook"
            className="w-5 h-5"
          />
          Facebook
        </button>
      </div>
    </div>
  );
}
