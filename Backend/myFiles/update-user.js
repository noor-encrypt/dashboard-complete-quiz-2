//File: update-user.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
import verifyToken from "../middleware/verifyToken.js"
import myUser from "../myschema/UserSchema.js";

const myRouter = myExpress.Router()

// PUT endpoint to update user profile - uses token-based authentication
myRouter.put('/', verifyToken, async (req, res) => {
    try {
        let mySuccess = false
        
        // Get email from decoded JWT token
        const userEmail = req.user.email
        
        if (!userEmail) {
            return res.status(401).json({ success: mySuccess, message: "Unauthorized: No email in token" })
        }

        // Find user by email
        const user = await myUser.findOne({ regEmail: userEmail })
        
        if (!user) {
            return res.status(404).json({ success: mySuccess, message: "User not found" })
        }

        // Extract fields from request body
        const { regName, regEmail: newEmail } = req.body

        // Create update object
        let updateData = {}
        if (regName) { updateData.regName = regName }
        if (newEmail) { updateData.regEmail = newEmail }

        // If no fields to update, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: mySuccess, message: "No fields to update" })
        }

        // Update user in database
        const updatedUser = await myUser.findByIdAndUpdate(
            user._id, 
            { $set: updateData }, 
            { new: true }
        )

        mySuccess = true
        res.json({
            success: mySuccess,
            message: "Profile updated successfully",
            userData: {
                regEmail: updatedUser.regEmail,
                regName: updatedUser.regName
            }
        })
    }
    catch (error) {
        console.error("Update error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// PUT endpoint to reset password - uses token-based authentication
myRouter.put('/reset-password', verifyToken, async (req, res) => {
    try {
        let mySuccess = false
        
        // Get email from decoded JWT token
        const userEmail = req.user.email
        
        if (!userEmail) {
            return res.status(401).json({ success: mySuccess, message: "Unauthorized: No email in token" })
        }

        // Extract passwords from request body
        const { oldPassword, newPassword, confirmPassword } = req.body

        // Validate required fields
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: mySuccess, message: "All fields are required" })
        }

        // Validate new password matches confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: mySuccess, message: "New passwords do not match" })
        }

        // Validate new password is different from old
        if (oldPassword === newPassword) {
            return res.status(400).json({ success: mySuccess, message: "New password must be different from old password" })
        }

        // Find user by email
        const user = await myUser.findOne({ regEmail: userEmail })
        
        if (!user) {
            return res.status(404).json({ success: mySuccess, message: "User not found" })
        }

        // Verify old password
        if (user.password !== oldPassword) {
            return res.status(401).json({ success: mySuccess, message: "Old password is incorrect" })
        }

        // Update password
        const updatedUser = await myUser.findByIdAndUpdate(
            user._id, 
            { $set: { password: newPassword } }, 
            { new: true }
        )

        mySuccess = true
        res.json({
            success: mySuccess,
            message: "Password reset successfully"
        })
    }
    catch (error) {
        console.error("Password reset error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// PUT endpoint to upload profile picture - uses token-based authentication
myRouter.put('/upload-pic', verifyToken, async (req, res) => {
    try {
        let mySuccess = false
        
        // Get email from decoded JWT token
        const userEmail = req.user.email
        
        if (!userEmail) {
            return res.status(401).json({ success: mySuccess, message: "Unauthorized: No email in token" })
        }

        // Extract base64 image data from request body
        const { profilePic } = req.body

        if (!profilePic) {
            return res.status(400).json({ success: mySuccess, message: "No image data provided" })
        }

        // Find user by email
        const user = await myUser.findOne({ regEmail: userEmail })
        
        if (!user) {
            return res.status(404).json({ success: mySuccess, message: "User not found" })
        }

        // Update profile picture
        const updatedUser = await myUser.findByIdAndUpdate(
            user._id, 
            { $set: { profilePic: profilePic } }, 
            { new: true }
        )

        mySuccess = true
        res.json({
            success: mySuccess,
            message: "Profile picture updated successfully",
            userData: {
                regEmail: updatedUser.regEmail,
                regName: updatedUser.regName,
                profilePic: updatedUser.profilePic
            }
        })
    }
    catch (error) {
        console.error("Upload picture error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

//exporting so that it can access from other files
export default myRouter;
