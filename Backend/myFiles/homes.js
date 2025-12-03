//File: homes.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
import verifyToken from "../middleware/verifyToken.js"
import myUser from "../myschema/UserSchema.js"
import HomeModel from "../myschema/HomeSchema.js"

const myRouter = myExpress.Router()

// Add/Create a home
myRouter.post('/add-home', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const user = await myUser.findOne({ regEmail: userEmail })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (!user.isHost) {
            return res.status(403).json({ success: false, message: "You must be a host to add homes" })
        }

        const { title, description, price, location, bedrooms, bathrooms, guests, images, amenities } = req.body

        // Validate required fields
        if (!title || !description || !price || !location || bedrooms === undefined || bathrooms === undefined || !guests) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // Create new home
        const newHome = new HomeModel({
            title,
            description,
            price,
            location,
            bedrooms,
            bathrooms,
            guests,
            images: images || [],
            amenities: amenities || [],
            hostId: userEmail,
            hostName: user.regName
        })

        const savedHome = await newHome.save()

        res.json({
            success: true,
            message: "Home created successfully",
            home: savedHome
        })
    }
    catch (error) {
        console.error("Add home error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all homes (public)
myRouter.get('/all-homes', async (req, res) => {
    try {
        const homes = await HomeModel.find()

        res.json({
            success: true,
            homes: homes
        })
    }
    catch (error) {
        console.error("Get all homes error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all homes by host
myRouter.get('/my-homes', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const homes = await HomeModel.find({ hostId: userEmail })

        res.json({
            success: true,
            homes: homes
        })
    }
    catch (error) {
        console.error("Get my homes error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get home by ID
myRouter.get('/home/:homeId', async (req, res) => {
    try {
        const { homeId } = req.params

        const home = await HomeModel.findById(homeId)

        if (!home) {
            return res.status(404).json({ success: false, message: "Home not found" })
        }

        res.json({
            success: true,
            home: home
        })
    }
    catch (error) {
        console.error("Get home error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Update home
myRouter.put('/update-home/:homeId', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email
        const { homeId } = req.params

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const home = await HomeModel.findById(homeId)

        if (!home) {
            return res.status(404).json({ success: false, message: "Home not found" })
        }

        // Check if user is the host
        if (home.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You can only update your own homes" })
        }

        const { title, description, price, location, bedrooms, bathrooms, guests, images, amenities } = req.body

        const updateData = {}
        if (title) updateData.title = title
        if (description) updateData.description = description
        if (price) updateData.price = price
        if (location) updateData.location = location
        if (bedrooms !== undefined) updateData.bedrooms = bedrooms
        if (bathrooms !== undefined) updateData.bathrooms = bathrooms
        if (guests) updateData.guests = guests
        if (images) updateData.images = images
        if (amenities) updateData.amenities = amenities
        updateData.updatedAt = Date.now()

        const updatedHome = await HomeModel.findByIdAndUpdate(
            homeId,
            { $set: updateData },
            { new: true }
        )

        res.json({
            success: true,
            message: "Home updated successfully",
            home: updatedHome
        })
    }
    catch (error) {
        console.error("Update home error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Delete home
myRouter.delete('/delete-home/:homeId', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email
        const { homeId } = req.params

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const home = await HomeModel.findById(homeId)

        if (!home) {
            return res.status(404).json({ success: false, message: "Home not found" })
        }

        // Check if user is the host
        if (home.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You can only delete your own homes" })
        }

        await HomeModel.findByIdAndDelete(homeId)

        res.json({
            success: true,
            message: "Home deleted successfully"
        })
    }
    catch (error) {
        console.error("Delete home error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

export default myRouter
