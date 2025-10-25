
const validator = require("validator")
const validateSignUp = (req) => {
    // firstName, lastName, emailId, password
    const {firstName, lastName, emailId, password} = req.body
    
    if (!firstName || ! lastName){
        throw Error("Name is not valid.. from validator")
    }
    if (firstName.length < 4 || firstName.length>50){
        throw Error('Length of the name should be between 4 and 50 characters')
    }
    if (!validator.isEmail(emailId)){
        throw Error('email is not valid')
    }
    if (!validator.isStrongPassword(password)){
        throw Error('password is not valid')
    }
}

const validateLogin = (req) => {
    const {emailId, password} = req.body
    if(!validator.isEmail(emailId)){
        throw Error('invalid credentials')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('invalid credentials')
    }
}

const validateEditProfileData = (req) => {
    const changeableFields = ["firstName", "lastName", "photoURL", "gender", "skills", "about", "email", "age"]

    const isAllowedEdit = Object.keys(req.body).every(field => changeableFields.includes(field))

    return isAllowedEdit
}

const validateForgotPassword= (req) => {
    const password = req.body.newPassword
    if(!validator.isStrongPassword(password)){
        throw Error('password is not valid')
    }
}

const validateEditPassword = (req) => {
    
}

module.exports = {
    validateSignUp,
    validateLogin,
    validateEditProfileData,
    validateForgotPassword
}