//File: update-user.js in ROOT-FOLDER/myFiles/ folder
 
const myExpress = require('express')
 
const myRouter = myExpress.Router()
const myUser = require('../myschema/UserSchema') //one folder back from "this" file
 
//:reqID4Delete is for getting ID from endpoint
myRouter.put('/:reqID4Update',
    async (req, res) => {
        let mySuccess = false
 
        //get id from endpoint
        let dataUpdating = req.params.reqID4Update
 
        //first checking; either the ID exist or not
        //getting the data that is being updated. Data's ID will be in URL/API
        let searchingData = {
            status: dataUpdating
        }
        const getData = await myUser.find(searchingData)
 
        //sending response if there is no data in the database against requested-ID
        if (!getData) {
            return res.status(404).send({ success: mySuccess, message: "No data exist having given value in endpoint" })
        }
 
        //getting requrested-content from req-body
        let newName = req.body.newName
        let newfName = req.body.newfName
 
        //creating object having updating data
        let newData = {} //blank object
        if (newName) { newData.name = newName } //create "name" field if data for newName exists
        if (newfName) { newData.fname = newfName }//create "fname" field if data for newfName exists
 
        try {
            console.log("IDs Count: ", getData.length)
            // Extracting _id values
            const ids = getData.map(element => element._id.toString());
 
            for (let index = 0; index < ids.length; index++) {
                const element = ids[index];
                const updatedData = await myUser.findByIdAndUpdate(element, { $set: newData }, { new: true })
            }
            mySuccess = true
            let sendResponseData = {
                message: "All IDs has been updated", success: mySuccess
            }
            res.json(sendResponseData)
        }
        catch (e) {
            res.status(400).send({ success: mySuccess, message: "Internal Server Error" })
        }
    }
)
//exporting so that it can access from other files
module.exports = myRouter