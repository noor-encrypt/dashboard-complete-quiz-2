import React, { useState } from "react";
import { sanitizeInput } from "./utils/sanitizeInput";
import { isAlphabetOnly } from "./utils/isAlphabetOnly";
import { charLength } from "./utils/charLength";
import { regEmailTest } from "./utils/regEmailTest";
import { useNavigate } from "react-router-dom";
export default function SignupPage() {
  // Error states
  const [errorOverallState, setErrorOverallState] = useState("");
  const [errorNameFieldState, setErrorNameFieldState] = useState("");
  const [errorEmailState, setErrorEmailState] = useState("");
  const [errorPassState, setErrorPassState] = useState("");

  // Input states
  const [InputData, setInputData] = useState({
    nameField: "",
    emailField: "",
    passField: "",
    rePassField: "",
  });

  // Update input values
  const onChangeInputData = (event) => {
    setInputData({ ...InputData, [event.target.name]: event.target.value });
  };

  // Send data to backend
 // Inside savingData function, update it like this:
const savingData = async (regEmail, regName, password) => {
  const myEndpoint = "http://localhost:5000/user/register-user/";
  try {
    const response = await fetch(myEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        regName: regName,
        regEmail: regEmail,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resJSON_Data = await response.json();
    
    console.log("Backend response:", resJSON_Data); // <-- debug line

    if (resJSON_Data.resStatus === "true") {
  
      alert("Registered successfully! Redirecting to Login...");
      window.location.href = "/login";
    } else {
      alert(resJSON_Data.message || "Registration failed");
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
};


  // Handle form submit
  const handleForm = (event) => {
    event.preventDefault();

    setErrorOverallState("");
    setErrorNameFieldState("");
    setErrorEmailState("");
    setErrorPassState("");

    let errorOverall = 1;

    // Name validation
    let nameField_get = sanitizeInput(InputData.nameField);
    if (nameField_get === "") {
      setErrorNameFieldState("Please enter your full name");
      errorOverall = 0;
    } else if (isAlphabetOnly(nameField_get) === 0) {
      setErrorNameFieldState("Only letters are allowed");
      errorOverall = 0;
    } else if (charLength(nameField_get, 6, 35) === 0) {
      setErrorNameFieldState("Name must be 6–35 characters");
      errorOverall = 0;
    }

    // Email validation
    let emailField_get = sanitizeInput(InputData.emailField);
    if (emailField_get === "") {
      setErrorEmailState("Please enter your email");
      errorOverall = 0;
    } else if (regEmailTest(emailField_get) === 0) {
      setErrorEmailState("Invalid email format");
      errorOverall = 0;
    }

    // Password validation
    let passField_get = sanitizeInput(InputData.passField);
    if (passField_get === "") {
      setErrorPassState("Please enter a password");
      errorOverall = 0;
    } else if (charLength(passField_get, 6, 35) === 0) {
      setErrorPassState("Password must be 6–35 characters");
      errorOverall = 0;
    }

    // Confirm password
    let rePassField_get = sanitizeInput(InputData.rePassField);
    if (passField_get !== rePassField_get) {
      setErrorPassState("Passwords do not match");
      errorOverall = 0;
    }

    if (errorOverall === 0) {
      setErrorOverallState("Please correct the highlighted errors");
      return;
    }

    // Send valid data to backend
    savingData(emailField_get, nameField_get, passField_get);
  };

  return (
    <div className="flex justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-200 min-h-[calc(100vh-80px)]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign up for Airbnb
        </h2>

        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <input
              type="text"
              name="nameField"
              value={InputData.nameField}
              onChange={onChangeInputData}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
            {errorNameFieldState && (
              <p className="text-red-500 text-sm mt-1">{errorNameFieldState}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="emailField"
              value={InputData.emailField}
              onChange={onChangeInputData}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
            {errorEmailState && (
              <p className="text-red-500 text-sm mt-1">{errorEmailState}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="passField"
              value={InputData.passField}
              onChange={onChangeInputData}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
          </div>

          <div>
            <input
              type="password"
              name="rePassField"
              value={InputData.rePassField}
              onChange={onChangeInputData}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            />
            {errorPassState && (
              <p className="text-red-500 text-sm mt-1">{errorPassState}</p>
            )}
          </div>

          {errorOverallState && (
            <p className="text-red-600 text-center text-sm">
              {errorOverallState}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 shadow-md transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 font-medium hover:underline">
            Log In
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
