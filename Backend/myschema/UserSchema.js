//File: UserSchema.js in ROOT-FOLDER/myschema/ folder
 
import UserMongoose from "mongoose"
const { Schema } = UserMongoose; // Destructure Schema from mongoose
 
const UserSchema = new Schema({
    regEmail: {
        type: String,
        required: true
    },
    regName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
 

const UserModel = UserMongoose.model('mycollection_login', UserSchema, 'mycollection_login');
 
export default UserModel;