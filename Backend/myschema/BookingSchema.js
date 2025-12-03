//File: BookingSchema.js in ROOT-FOLDER/myschema/ folder

import BookingMongoose from "mongoose"
const { Schema } = BookingMongoose;

const BookingSchema = new Schema({
    userId: {
        type: String,
        required: true // email of the guest
    },
    userName: {
        type: String,
        required: true
    },
    hostId: {
        type: String,
        required: true // email of the host
    },
    hostName: {
        type: String,
        required: true
    },
    propertyId: {
        type: String,
        required: true // ID of home or service
    },
    propertyType: {
        type: String,
        enum: ['home', 'service'],
        required: true
    },
    propertyTitle: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    numberOfNights: {
        type: Number,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guestCount: {
        type: Number,
        required: true
    },
    specialRequests: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    cancellationReason: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    confirmedAt: {
        type: Date,
        default: null
    },
    cancelledAt: {
        type: Date,
        default: null
    }
});

const BookingModel = BookingMongoose.model('bookings', BookingSchema, 'bookings');

export default BookingModel;
