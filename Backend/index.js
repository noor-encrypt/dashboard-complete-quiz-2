//File: index.js in root directory
import connectToMongo from "./db.js"  //getting connectToMongo() from db.js that was exported
import all_user from "./myFiles/all-user.js"
import register_user from "./myFiles/register-user.js"
import get_profile from "./myFiles/get-profile.js"
//running above required-code
connectToMongo()
import loginUser from "./myFiles/login-user.js";

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
app.use('/user/delete-user', require("./myFiles/delete-user"))
app.use('/user/get-profile', get_profile)
app.use("/user/login-user", loginUser);
//route for update-user
app.use('/user/update-user', require("./myFiles/update-user"))
const port = 5000

app.listen(port)