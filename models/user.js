const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 4,
        maxLength: 100,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw Error('This is not a valid email id')
            }
        }
        
    },
    password: {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw Error('Weak password try something stronger')
            }
        }
    },
    number: {
        type: Number,
    },
    age: {
        type: Number,
        min: 18,
        // max: 100
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw Error("please select the correct gender")
            }
        }
    },
    photoURl : {
        type: String
    },
    about : {
        type: String
    },
    skills: {
        type: [String]
    },
    

},{
        timestamps: true
    })


userSchema.methods.getJWT = async function(){
    const user = this
    const token = await jwt.sign({_id: this._id}, "kozhikode",  {expiresIn: '1d'})
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const hashedPassword = this.password
    const isPasswordValidated = await bcrypt.compare(passwordInputByUser, hashedPassword)
    return isPasswordValidated
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel