const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already Taken"],
        required: true,
    },

    email:{
        type: String,
        unique:[true, "Account already exists with this Email address"],
        required: true,
    },

    password: {
        type: String,
        required: true,
    }
})

const userModel = mongoose.model("users", userSchema)
module.exports = userModel