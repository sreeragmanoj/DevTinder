const express = require('express')
const {validateSignUp} = require('../utils/validate')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    try{
    // validate the data coming
    validateSignUp(req)

    const {firstName, lastName, emailId, password} = req.body
    // encrypt the password
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const data = req.body
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword
    })
        await user.save();
        res.send('Data added successfully to the database')
    }
    catch(err){
        res.status(400).send('ERROR : '+ err)
    }
})

authRouter.post('/login', async (req, res) => {
    const {emailId, password} = req.body
    try{
        const user = await User.findOne({emailId : emailId})
        console.log(user.password)
        if (!user) {
            throw Error('invalid credentials')
        }
        const passwordCheck = await user.validatePassword(password)
        if (passwordCheck){
            const token = await user.getJWT()
            res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)})
            res.send('logged in successfully')
        } else {
            throw Error('invalid credentials')
        }

    } catch (err){
        res.status(400).send("Error : "+err)
    }
})


module.exports = authRouter
