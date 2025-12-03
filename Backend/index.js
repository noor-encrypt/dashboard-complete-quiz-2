//File: index.js in root directory
import connectToMongo from "./db.js"  //getting connectToMongo() from db.js that was exported
import all_user from "./myFiles/all-user.js"
import register_user from "./myFiles/register-user.js"
import get_profile from "./myFiles/get-profile.js"
//running above required-code
connectToMongo()
import loginUser from "./myFiles/login-user.js";
import deleteUser from "./myFiles/delete-user.js"
import updateUser from "./myFiles/update-user.js"
import servicesRouter from "./myFiles/services.js"
import homesRouter from "./myFiles/homes.js"
import express from "express"

//adding package that will allow communication with frontend
import cors from "cors"


const app = express()

app.use(cors())

//allowing communication on base of json
app.use(express.json())

//route for all-user
app.use('/user', all_user)//displaying all user

//route for register-user
app.use('/user/register-user', register_user)
//route for delete-user
app.use('/user/delete-user', deleteUser);
app.use('/user/get-profile', get_profile);
app.use("/user/login-user", loginUser);
//route for update-user (PUT request to update profile with token auth)
app.use('/user/update-user', updateUser);
//route for services
app.use('/services', servicesRouter);
//route for homes
app.use('/homes', homesRouter);
const port = 5000

app.listen(port);