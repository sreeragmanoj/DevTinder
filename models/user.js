const mongoose = require('mongoose')

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
        required: true
    },
    password: {
        type: String,
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

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel