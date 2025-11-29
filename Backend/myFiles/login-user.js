// File: login-user.js  (inside ROOT-FOLDER/myFiles/)
import myExpress from "express";
import myUser from "../myschema/UserSchema.js";
import jwt from "jsonwebtoken";

const myRouter = myExpress.Router();

// Same secret key used in register-user.js
const JWT_SECRET = "mySuperSecretKey_12345";

myRouter.post("/", async (req, res) => {
  try {
    const { regEmail, password } = req.body;

    // 1️⃣ Check required fields
    if (!regEmail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user by email
    const user = await myUser.findOne({ regEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Compare password (plain text, same as your register)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 4️⃣ Create JWT payload
    const payload_data = {
      email: user.regEmail,
      name: user.regName,
      userType: "user",
    };

    // 5️⃣ Generate JWT token (valid for 1 hour)
    const token = jwt.sign(payload_data, JWT_SECRET, { expiresIn: "1h" });

    // 6️⃣ Send JSON response to frontend
    return res.status(200).json({
      message: "Login successful",
      token: token,
      userData: {
        regEmail: user.regEmail,
        regName: user.regName,
      },
    });
  } catch (err) {
    console.error("Login route error:", err);
    return res.status(500).json({
      message: "Server error during login",
      error: err.message,
    });
  }
});

export default myRouter;
