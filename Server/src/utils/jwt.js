import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

export const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

export const verifyToken = (token) => jwt.verify(token, SECRET);