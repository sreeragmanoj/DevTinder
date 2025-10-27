const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const User = require("../models/user")
const connectionRouter = express.Router()
const mongoose = require('mongoose')

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

connectionRouter.post('/request/receive/:status/:requestId', userAuth, async (req, res) => {
    try{
        const {status, requestId} = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"]
        const isStatusAllowed = allowedStatus.includes(status)
        if (!isStatusAllowed){
            throw Error('Status is not allowed, it should be accepted or rejected')
        }
        // const debug = await connectionRequest.findById(requestId);
        // console.log("DB record:", debug);

        const user = await connectionRequest.findOne({
            _id :  requestId,
            toUserId: loggedInUser._id,
            status: "interested"}
        )
        console.log(user)
        console.log(requestId)
        console.log(loggedInUser._id)
        console.log(status)
        if (!user){
            throw Error('no request available')
        }
        user.status = status
        const userData = await user.save();
        user.save()
        res.json({
            status: 200,
            message: "your data have been changes ",
            user,
        })
        } catch (err) {
            res.status(400).json({
                status: 400,
                message: 'ERROR : '+ err
            })
        }

})


module.exports = connectionRouter