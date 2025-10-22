// require("mongodb")
const mongoose = require("mongoose")

const URl = "mongodb://127.0.0.1:27017/DevTinder"

const connectDB = async () => {
    await mongoose.connect(URl)
}

module.exports = connectDB

 
