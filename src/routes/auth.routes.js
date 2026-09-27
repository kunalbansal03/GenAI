const {route, Router} = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Registers a new user, expects username, email and password in the request body, hashes the password and saves the user to the database, generates a JWT token and sends it back in the response
 * @access Public
 */

authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/register
 * @description Registers a new user, expects username, email and password in the request body, hashes the password and saves the user to the database, generates a JWT token and sends it back in the response
 * @access Public
 */

authRouter.post("/login", authController.loginUserController)






/**
 * @route GET /api/auth/logout
 * @description Clear the JWT token from the client side, adds the token to the blacklist collection in the database
 * @access public
 */

authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user details
 * @access private
 */

authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter