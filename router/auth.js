const express = require('express')
const {validateSignUp} = require('../utils/validate')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport')
// import passport from "passport";
// import jwt from "jsonwebtoken";
const jwt = require('jsonwebtoken')
// import dotenv from "dotenv";
const dotenv = require('dotenv')

// import passport from "../config/passport"
dotenv.config();

const authRouter = express.Router()

authRouter.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // console.log(req)
    console.log('inside the call back ')
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log('this is the token')
    console.log(token)
    res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)})
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  }
);

authRouter.post('/signup', async (req, res) => {
    try{
    // validate the data coming
    validateSignUp(req)

    const {firstName, lastName, emailId, password, age, gender, longitude, latitude} = req.body
    // encrypt the password
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const data = req.body
    const user = new User({
        firstName,
        lastName,
        emailId,
        age,
        gender,
        location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
        password: hashedPassword
    })
        // await User.findByIdAndUpdate(userId, {
        //     location: {
        //         type: "Point",
        //         coordinates: [longitude, latitude],
        //     },
        //     });

        console.log(user)
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

authRouter.post('/logout', (req, res) => {
    // for large company there will be clean up api here 
    res.clearCookie('token')
    res.send('User logged out...')
})


module.exports = authRouter
