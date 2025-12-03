//File: ServiceSchema.js in ROOT-FOLDER/myschema/ folder

import ServiceMongoose from "mongoose"
const { Schema } = ServiceMongoose; // Destructure Schema from mongoose

const ServiceSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const ServiceModel = ServiceMongoose.model('services', ServiceSchema, 'services');

export default ServiceModel;
