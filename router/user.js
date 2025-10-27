const express = require('express')
const connectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
const { userAuth } = require('../middlewares/auth')
const userRouter = express.Router()

const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age"]

userRouter.get('/user/request/received', userAuth , async (req, res) =>{
    try{
        const loggedInUser = req.user
        const allRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", "firstName lastName age photoURL")
        res.json({
            status: 400,
            message: allRequests
        })
    } catch(err) {
        res.json({
            status: 400,
            message: "ERROR : "+ err
        })
    }

})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const allConnections = await connectionRequest.find({
            $or:[
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        })
        .populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA)
        const data = allConnections.map((row) =>{
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        console.log(allConnections)
        res.json({
            status: 200,
            message: data
        })
    } catch (err) {
        res.json({
            status: 400,
            message: 'ERROR : '+ err
        })
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page-1)*limit
        console.log(skip)
        console.log(limit)

        const connectionRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select('fromUserId toUserId')
        // .populate('fromUserId toUserId')

        const userHideFromFeed = new Set();
        connectionRequests.forEach((req) => {
            userHideFromFeed.add(req.fromUserId.toString())
            userHideFromFeed.add(req.toUserId.toString())
        })
        console.log(userHideFromFeed)

        const feedUsers = await User.find({
            $and: [
                {_id: { $nin: Array.from(userHideFromFeed)}},
                {_id: { $ne: loggedInUser._id}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({
            status: 200,
            message: feedUsers
        })
    } catch ( err ){
        res.json({
            status: 400,
            message: 'ERROR : ' + err
        })
    }

})


module.exports = userRouter