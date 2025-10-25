const express = require('express')
const {userAuth} = require('../middlewares/auth')
const {validateEditProfileData, validateForgotPassword} = require('../utils/validate')
const bcrypt = require('bcrypt')
const { isPassportNumber } = require('validator')

const profileRouter = express.Router()

profileRouter.get('/profile', userAuth, async (req, res) => {
    try{
        res.send(req.user)
        } catch (err) {
            res.send('ERROR :'+ err.message)
        }
})

profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
    try{
        validateForgotPassword(req)
        const {currentPassword, newPassword} = req.body
        const {password} = req.user
        const user = req.user
        isPasswordChecks = await bcrypt.compare(currentPassword, password)
        
        if (!isPasswordChecks){
            throw Error('current password is not matching the actual password')
            }
        user.password = await bcrypt.hash(newPassword, 10)
        user.save()
        res.send(`your password have been changed to ${user.password}, ${newPassword}`)

    } catch ( err ){
        res.status(400).json({
            "status": 400,
            "message": "ERROR : "+ err
    })
    }
})

profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw Error('some of the fields cant be edited....')
        }
        const user = req.user
        console.log(user)
        Object.keys(req.body).forEach(key => user[key] = req.body[key])
        user.save()
        res.send(`Hey ${user.firstName}, your data has been updated successfully..  `)
    } catch (err){
        res.status(400).send("ERROR :"+err)
    }
    
})

module.exports = profileRouter