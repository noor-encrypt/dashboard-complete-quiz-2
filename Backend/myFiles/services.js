//File: services.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
import verifyToken from "../middleware/verifyToken.js"
import myUser from "../myschema/UserSchema.js"
import ServiceModel from "../myschema/ServiceSchema.js"

const myRouter = myExpress.Router()

// Become a host
myRouter.put('/become-host', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const user = await myUser.findOne({ regEmail: userEmail })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Update user to host status
        const updatedUser = await myUser.findByIdAndUpdate(
            user._id,
            { $set: { isHost: true } },
            { new: true }
        )

        res.json({
            success: true,
            message: "You are now a host!",
            userData: {
                regEmail: updatedUser.regEmail,
                regName: updatedUser.regName,
                isHost: updatedUser.isHost
            }
        })
    }
    catch (error) {
        console.error("Become host error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Add/Create a service
myRouter.post('/add-service', verifyToken, async (req, res) => {
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
            return res.status(403).json({ success: false, message: "You must be a host to add services" })
        }

        const { title, description, price, location, images, amenities } = req.body

        // Validate required fields
        if (!title || !description || !price || !location) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // Create new service
        const newService = new ServiceModel({
            title,
            description,
            price,
            location,
            images: images || [],
            amenities: amenities || [],
            hostId: userEmail,
            hostName: user.regName
        })

        const savedService = await newService.save()

        res.json({
            success: true,
            message: "Service created successfully",
            service: savedService
        })
    }
    catch (error) {
        console.error("Add service error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all services by host
myRouter.get('/my-services', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const services = await ServiceModel.find({ hostId: userEmail })

        res.json({
            success: true,
            services: services
        })
    }
    catch (error) {
        console.error("Get services error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all services (public)
myRouter.get('/all-services', async (req, res) => {
    try {
        const services = await ServiceModel.find()

        res.json({
            success: true,
            services: services
        })
    }
    catch (error) {
        console.error("Get all services error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get service by ID
myRouter.get('/service/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params

        const service = await ServiceModel.findById(serviceId)

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }

        res.json({
            success: true,
            service: service
        })
    }
    catch (error) {
        console.error("Get service error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Update service
myRouter.put('/update-service/:serviceId', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email
        const { serviceId } = req.params

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const service = await ServiceModel.findById(serviceId)

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }

        // Check if user is the host
        if (service.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You can only update your own services" })
        }

        const { title, description, price, location, images, amenities } = req.body

        const updateData = {}
        if (title) updateData.title = title
        if (description) updateData.description = description
        if (price) updateData.price = price
        if (location) updateData.location = location
        if (images) updateData.images = images
        if (amenities) updateData.amenities = amenities
        updateData.updatedAt = Date.now()

        const updatedService = await ServiceModel.findByIdAndUpdate(
            serviceId,
            { $set: updateData },
            { new: true }
        )

        res.json({
            success: true,
            message: "Service updated successfully",
            service: updatedService
        })
    }
    catch (error) {
        console.error("Update service error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Delete service
myRouter.delete('/delete-service/:serviceId', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email
        const { serviceId } = req.params

        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: No email in token" })
        }

        const service = await ServiceModel.findById(serviceId)

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" })
        }

        // Check if user is the host
        if (service.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You can only delete your own services" })
        }

        await ServiceModel.findByIdAndDelete(serviceId)

        res.json({
            success: true,
            message: "Service deleted successfully"
        })
    }
    catch (error) {
        console.error("Delete service error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

export default myRouter
