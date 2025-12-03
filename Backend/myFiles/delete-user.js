//File: delete-user.js in ROOT-FOLDER/myFiles/ folder
 
import myExpress from "express"
import verifyToken from "../middleware/verifyToken.js"
// MUST include .js extension in ESM
import myUser from "../myschema/UserSchema.js";
 
const myRouter = myExpress.Router()

// DELETE endpoint to delete user account - uses token-based authentication
myRouter.delete('/', verifyToken, async (req, res) => {
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

        // Delete the user
        await myUser.findByIdAndDelete(user._id)
        
        mySuccess = true
        res.json({
            success: mySuccess,
            message: "Account deleted successfully"
        })
    }
    catch (error) {
        console.error("Delete error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

//exporting so that it can access from other files
export default myRouter;
