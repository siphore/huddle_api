import express from "express";
import User from "../models/user.js";
import Token from "../models/token.js";
import { authenticate } from "./auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as config from "../config.js";
import { promisify } from "util";
import { log } from "console";

const signJwt = promisify(jwt.sign);

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {String} users._id Unique identifier of the user.
 * @apiSuccess {String} users.username Username of the user.
 * @apiSuccess {String} users.email Email of the user.
 * @apiSuccess {String} users.language Preferred language of the user.
 * @apiSuccess {String} users.location Location of the user.
 * @apiSuccess {Number} users.__v Version key.
 */
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const users = await User.find()
      .sort({ fname: 1 })
      .select("-password")
      .exec(); // Exclude passwords
    res.json(users);
  })
);

/**
 * @api {get} /users/:id Get user by ID
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam {String} id Unique identifier of the user.
 *
 * @apiSuccess {String} _id Unique identifier of the user.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {String} email Email of the user.
 * @apiSuccess {String} language Preferred language of the user.
 * @apiSuccess {String} location Location of the user.
 * @apiSuccess {Number} __v Version key.
 *
 * @apiError {Object} 404 UserNotFound The user with the specified ID was not found.
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

/**
 * @api {post} /users Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 * @apiParam {String} language Preferred language of the user.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Object} user Details of the created user.
 * @apiSuccess {String} user._id Unique identifier of the user.
 * @apiSuccess {String} user.username Username of the user.
 * @apiSuccess {String} user.email Email of the user.
 * @apiSuccess {String} user.role Optional. The role of the user. Possible values: "regular" or "admin". Default: "regular".
 * @apiSuccess {String} user.language Preferred language of the user.
 * @apiSuccess {String} user.location Location of the user.
 * @apiSuccess {Number} user.__v Version key.
 *
 * @apiError {Object} 409 EmailAlreadyRegistered The provided email is already in use.
 */
router.post("/", async (req, res) => {
  const { fname, lname, email, password, role } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  // Créer un nouvel utilisateur sans hacher le mot de passe ici
  const newUser = new User({
    fname,
    lname,
    email,
    password,
    role,
  });

  await newUser.save();
  res.status(201).json({ message: "User created", user: newUser });
});

/**
 * @api {put} /users/:id Update user by ID
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} id Unique identifier of the user.
 * @apiParam {String} [username] Updated username.
 * @apiParam {String} [email] Updated email.
 * @apiParam {String} [password] Updated password.
 * @apiParam {String} [language] Updated language preference.
 * @apiParam {String} [location] Updated location.
 *
 * @apiSuccess {String} _id Unique identifier of the user.
 * @apiSuccess {String} username Updated username of the user.
 * @apiSuccess {String} email Updated email of the user.
 * @apiSuccess {String} language Updated language preference of the user.
 * @apiSuccess {String} location Updated location of the user.
 * @apiSuccess {Number} __v Version key.
 *
 * @apiError {Object} 404 UserNotFound The user with the specified ID was not found.
 * @apiError {Object} 400 ValidationErrors Validation errors in the provided fields.
 */
router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const updates = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Explicitly check for empty strings and replace them with undefined
    if (updates.username !== undefined && updates.username.trim() === "") {
      return res.status(400).json({ errors: ["Username is required"] });
    }
    if (updates.email !== undefined && updates.email.trim() === "") {
      return res.status(400).json({ errors: ["Email is required"] });
    }
    if (updates.password !== undefined && updates.password.trim() === "") {
      return res.status(400).json({ errors: ["Password is required"] });
    }

    // Update fields
    if (updates.username) user.username = updates.username;
    if (updates.email) user.email = updates.email;
    if (updates.password) user.password = updates.password;
    if (updates.language) user.language = updates.language;
    if (updates.location) user.location = updates.location;

    try {
      await user.save(); // This will trigger schema validation
      res.json(user);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({ errors });
      }
      next(error); // Pass other errors to the error handler
    }
  })
);

/**
 * @api {delete} /users/:id Delete user by ID
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} id Unique identifier of the user.
 *
 * @apiSuccess {String} message Confirmation message.
 * @apiSuccess {Object} deletedUser Details of the deleted user.
 * @apiSuccess {String} deletedUser._id Unique identifier of the deleted user.
 * @apiSuccess {String} deletedUser.username Username of the deleted user.
 * @apiSuccess {String} deletedUser.email Email of the deleted user.
 * @apiSuccess {String} deletedUser.language Preferred language of the deleted user.
 * @apiSuccess {String} deletedUser.location Location of the deleted user.
 * @apiSuccess {Number} deletedUser.__v Version key.
 *
 * @apiError {Object} 404 UserNotFound The user with the specified ID was not found.
 */
router.delete(
  "/:id",
  // authenticate,
  asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully", deletedUser });
  })
);

/**
 * @api {post} /users/login Login a user
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiSuccess {String} message Welcome message.
 * @apiSuccess {String} token JWT token for authentication.
 * @apiSuccess {String} id Unique identifier of the logged-in user.
 *
 * @apiError {Object} 401 InvalidCredentials The provided email or password is incorrect.
 */
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" }); // Unauthorized

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" }); // Unauthorized

    // Login is valid...
    const exp = Math.floor(Date.now() / 1000 + 60 * 60 * 24); // 24 hours
    const token = await signJwt({ sub: user._id, exp }, config.secret);

    // Store token in database
    const newToken = new Token({
      token,
      userId: user._id,
      expiresAt: new Date(exp * 1000), // Convert to milliseconds
    });
    await newToken.save();

    res.send({
      message: `Bienvenue ${user.email} !`,
      token: { token, exp },
      id: user.id,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /users/logout Logout a user
 * @apiName LogoutUser
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer token of the user.
 *
 * @apiSuccess {String} message Confirmation message.
 *
 * @apiError {Object} 400 BadRequest Token was not provided.
 * @apiError {Object} 404 TokenNotFound The provided token was not found.
 */
router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(400); // Bad Request

  try {
    const storedToken = await Token.findOneAndDelete({ token }); // Attempt to delete the token
    if (!storedToken) {
      return res.status(404).json({ message: "Token not found" }); // Token doesn't exist
    }
    res.send({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error during logout" });
  }
});

export default router;
