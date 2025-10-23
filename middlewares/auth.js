const jwt = require('jsonwebtoken')
const User = require('../models/user')

const adminAuth = (req, res, next) => {
    const token = '12345'
    const isAuth = token === '12345'
    if (!isAuth){
        res.status(400).send('authentication required')
    } else {
        next()
    }
}
const userAuth = async (req, res, next) => {
    try{// read the token from the req.cookies
    const cookies = req.cookies
    // validate the token
    const {token} = cookies
    if(!token){
        throw Error('Please login...')
    }
    const decodedCookies = await jwt.verify(token, 'kozhikode')
    const {_id} = decodedCookies
    // Find the user
    const user = await User.findById(_id)
    if(!user){
        throw Error('User not found')
    }
    req.user = user
    next()}
    catch(err){
        res.status(400).send('User not found')
    }

}

module.exports = {
    adminAuth, 
    userAuth,
};