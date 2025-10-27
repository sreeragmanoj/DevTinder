const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // using this we created a relationship between user and connection request
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is incorrect status type"
            },
        },
    },
    { timestamps: true }
)

connectionRequestSchema.pre('save', function (){
    if(this.fromUserId.equals(this.toUserId)){
        throw Error('you cant send a request to your self')
    }
})

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;