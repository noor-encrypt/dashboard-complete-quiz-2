//File: bookings.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
import verifyToken from "../middleware/verifyToken.js"
import BookingModel from "../myschema/BookingSchema.js"
import myUser from "../myschema/UserSchema.js"
import HomeModel from "../myschema/HomeSchema.js"
import ServiceModel from "../myschema/ServiceSchema.js"

const myRouter = myExpress.Router()

// Create a booking (for homes or services)
myRouter.post('/create-booking', verifyToken, async (req, res) => {
    try {
        const userId = req.user.email
        const { propertyId, propertyType, checkInDate, checkOutDate, guestCount, specialRequests } = req.body

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        // Get user info
        const user = await myUser.findOne({ regEmail: userId })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Get property info
        let property, hostId, propertyTitle, pricePerNight
        
        if (propertyType === 'home') {
            property = await HomeModel.findById(propertyId)
            if (!property) {
                return res.status(404).json({ success: false, message: "Home not found" })
            }
            hostId = property.hostId
            propertyTitle = property.title
            pricePerNight = property.price
        } else if (propertyType === 'service') {
            property = await ServiceModel.findById(propertyId)
            if (!property) {
                return res.status(404).json({ success: false, message: "Service not found" })
            }
            hostId = property.hostId
            propertyTitle = property.title
            pricePerNight = property.price
        } else {
            return res.status(400).json({ success: false, message: "Invalid property type" })
        }

        // Get host info
        const host = await myUser.findOne({ regEmail: hostId })
        if (!host) {
            return res.status(404).json({ success: false, message: "Host not found" })
        }

        // Validate dates
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        
        if (checkIn >= checkOut) {
            return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" })
        }

        // Calculate number of nights
        const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        const totalPrice = numberOfNights * pricePerNight

        // Check if dates are available (no overlapping bookings)
        const existingBooking = await BookingModel.findOne({
            propertyId: propertyId,
            propertyType: propertyType,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ]
        })

        if (existingBooking) {
            return res.status(409).json({ success: false, message: "Property is not available for selected dates" })
        }

        // Create booking
        const newBooking = new BookingModel({
            userId: userId,
            userName: user.regName,
            hostId: hostId,
            hostName: host.regName,
            propertyId: propertyId,
            propertyType: propertyType,
            propertyTitle: propertyTitle,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfNights: numberOfNights,
            pricePerNight: pricePerNight,
            totalPrice: totalPrice,
            guestCount: guestCount,
            specialRequests: specialRequests || "",
            status: 'pending',
            paymentStatus: 'unpaid'
        })

        await newBooking.save()

        res.json({
            success: true,
            message: "Booking created successfully!",
            booking: newBooking
        })
    }
    catch (error) {
        console.error("Create booking error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all bookings for a guest
myRouter.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const userId = req.user.email

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const bookings = await BookingModel.find({ userId: userId }).sort({ createdAt: -1 })

        res.json({
            success: true,
            bookings: bookings
        })
    }
    catch (error) {
        console.error("Get bookings error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get all bookings for a host (for their properties)
myRouter.get('/host-bookings', verifyToken, async (req, res) => {
    try {
        const hostId = req.user.email

        if (!hostId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        const bookings = await BookingModel.find({ hostId: hostId }).sort({ createdAt: -1 })

        res.json({
            success: true,
            bookings: bookings
        })
    }
    catch (error) {
        console.error("Get host bookings error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Get single booking
myRouter.get('/booking/:bookingId', verifyToken, async (req, res) => {
    try {
        const { bookingId } = req.params
        const userEmail = req.user.email

        const booking = await BookingModel.findById(bookingId)

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }

        // Check if user is guest or host
        if (booking.userId !== userEmail && booking.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You don't have access to this booking" })
        }

        res.json({
            success: true,
            booking: booking
        })
    }
    catch (error) {
        console.error("Get booking error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Confirm booking (host only)
myRouter.put('/confirm-booking/:bookingId', verifyToken, async (req, res) => {
    try {
        const { bookingId } = req.params
        const hostEmail = req.user.email

        const booking = await BookingModel.findById(bookingId)

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }

        if (booking.hostId !== hostEmail) {
            return res.status(403).json({ success: false, message: "Only host can confirm booking" })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Can only confirm pending bookings" })
        }

        booking.status = 'confirmed'
        booking.paymentStatus = 'paid'
        booking.confirmedAt = new Date()
        await booking.save()

        res.json({
            success: true,
            message: "Booking confirmed successfully!",
            booking: booking
        })
    }
    catch (error) {
        console.error("Confirm booking error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Cancel booking
myRouter.put('/cancel-booking/:bookingId', verifyToken, async (req, res) => {
    try {
        const { bookingId } = req.params
        const userEmail = req.user.email
        const { reason } = req.body

        const booking = await BookingModel.findById(bookingId)

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }

        // Either guest or host can cancel
        if (booking.userId !== userEmail && booking.hostId !== userEmail) {
            return res.status(403).json({ success: false, message: "You don't have permission to cancel this booking" })
        }

        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ success: false, message: "Cannot cancel this booking" })
        }

        booking.status = 'cancelled'
        booking.paymentStatus = 'refunded'
        booking.cancellationReason = reason || ""
        booking.cancelledAt = new Date()
        await booking.save()

        res.json({
            success: true,
            message: "Booking cancelled successfully!",
            booking: booking
        })
    }
    catch (error) {
        console.error("Cancel booking error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

// Mark booking as completed
myRouter.put('/complete-booking/:bookingId', verifyToken, async (req, res) => {
    try {
        const { bookingId } = req.params
        const hostEmail = req.user.email

        const booking = await BookingModel.findById(bookingId)

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }

        if (booking.hostId !== hostEmail) {
            return res.status(403).json({ success: false, message: "Only host can mark as completed" })
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ success: false, message: "Can only complete confirmed bookings" })
        }

        booking.status = 'completed'
        await booking.save()

        res.json({
            success: true,
            message: "Booking marked as completed!",
            booking: booking
        })
    }
    catch (error) {
        console.error("Complete booking error: ", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})

export default myRouter
