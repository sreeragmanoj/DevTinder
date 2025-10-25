const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const User = require("../models/user")
const connectionRouter = express.Router()

connectionRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try{
    const toUserId = req.params.toUserId
    const status = req.params.status
    const fromUserId = req.user._id
    const allowedStatus = ['interested', "ignored"]
    if (!allowedStatus.includes(status)){
        throw Error('only interested and ignored status are acceptable....')
    }

    const user = await User.findById(toUserId)
    console.log(user)
    if(!user){
        throw Error('cannot find the user')
    }


    const ifRequestAlreadyExist = await connectionRequest.findOne({
        $or: [
            {
                fromUserId,
                toUserId
            },
            {
                "fromUserId" : toUserId,
                "toUserId" : fromUserId
            }
        ]
    })
    if (ifRequestAlreadyExist){
        throw Error('Request already exist in the database')
    }
    const newConnection = new connectionRequest({
        toUserId,
        fromUserId,
        status
    })
    const data = await newConnection.save()
    res.json({
        status : 200,
        message: `${toUserId} ${fromUserId} this is the users ${data}`
    })
    } catch(err){
        res.status(400).json({
            "status" : 400,
            "message" : "ERROR : "+ err
        })
    }

})


module.exports = connectionRouter