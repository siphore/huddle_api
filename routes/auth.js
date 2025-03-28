import jwt from "jsonwebtoken";
import { promisify } from "util";
import { secret } from "../config.js";
import Token from "../models/token.js";
import User from "../models/user.js";

const verifyJwt = promisify(jwt.verify);

export async function authenticate(req, res, next) {
  try {
    // Ensure the header is present
    const authorization = req.get("Authorization");
    if (!authorization) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    // Check that the header has the correct format
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Authorization header is not a bearer token" });
    }

    // Extract the JWT
    const token = match[1];

    // Verify the JWT
    const payload = await verifyJwt(token, secret);

    // Check if the token exists in the database
    const storedToken = await Token.findOne({ token });
    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Token is invalid or has been revoked" });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach the user ID to the request for use in subsequent middleware
    req.currentUser = user;
    req.currentUserId = payload.sub;

    next(); // Pass control to the next middleware
  } catch (err) {
    res.status(401).json({ message: "Your token is invalid or has expired" });
  }
}
