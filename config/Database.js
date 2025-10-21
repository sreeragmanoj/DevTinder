// require("mongodb")
const mongoose = require("mongoose")

const URl = "mongodb+srv://DevTinder:sree1234@sreerag.ig35pxd.mongodb.net/DevTinder"

const connectDB = async () => {
    await mongoose.connect(URl)
}

module.exports = connectDB

 
