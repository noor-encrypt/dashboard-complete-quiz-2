//File: get_profile.js in ROOT-FOLDER/myFiles/ folder

import myExpress from "express"
const myRouter = myExpress.Router()
import verifyToken from "../middleware/verifyToken.js"
import myUser from "../myschema/UserSchema.js" //one folder back from "this" file

myRouter.get('/', verifyToken, async (req, res) => {
    const payload_data = req.user;
    //console.log("payload_data1: ", payload_data)
    let user_email = payload_data.email
    //console.log("user_email: ", user_email)


    const user_get = await myUser.findOne({ regEmail: user_email })
    //console.log("user_get: ", user_get)


    const userData = {
        regEmail: user_get.regEmail,
        regName: user_get.regName
    }


    res.json({
        message: "OK",
        user: req.user, // contains decoded JWT payload
        userData: userData
    });
});

//exporting so that it can access from other files
export default myRouter;