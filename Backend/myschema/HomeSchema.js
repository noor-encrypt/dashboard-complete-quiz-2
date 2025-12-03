//File: HomeSchema.js in ROOT-FOLDER/myschema/ folder

import HomeMongoose from "mongoose"
const { Schema } = HomeMongoose; // Destructure Schema from mongoose

const HomeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true,
        min: 0
    },
    bathrooms: {
        type: Number,
        required: true,
        min: 0
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    images: [
        {
            type: String // base64 encoded images
        }
    ],
    amenities: [
        {
            type: String
        }
    ],
    hostId: {
        type: String, // Email of the host
        required: true
    },
    hostName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const HomeModel = HomeMongoose.model('homes', HomeSchema, 'homes');

export default HomeModel;
