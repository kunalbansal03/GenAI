const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


/** 
 * @name registerUserController
 * @description Registers a new user, expects username, email and password in the request body, hashes the password and saves the user to the database, generates a JWT token and sends it back in the response
 * @access Public
 */


async function registerUserController(req,res) {
    const { username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ {username}, {email} ]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this username or email address"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}




async function loginUserController(req,res) {
    const { email, password} = req.body
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or Password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User LoggedIn Successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}



/**
 * @route GET /api/auth/logout
 * @description Clear the JWT token from the client side, adds the token to the blacklist collection in the database
 * @access public 
 */


async function logoutUserController(req,res) {
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User Logged out Successfully "
    })

}


/** 
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user details
 * @access private 
 */

async function getMeController(req,res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}