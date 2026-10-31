import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { signToken } from "../utils/jwt.js";
import { signupSchema, loginSchema } from "../utils/validation.js";
import { OAuth2Client } from "google-auth-library";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  title: user.title,       
  bio: user.bio,           
  bannerUrl: user.bannerUrl,
  avatarUrl: user.avatarUrl, 
  createdAt: user.createdAt
});

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user.id, email: user.email });

    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/auth/me
// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("AUTH ME ERROR DETAILS:", err); 
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload.email_verified) {
  return res.status(401).json({ message: "Google email not verified" });
}
    const { email, name, picture, sub } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create a new user if they don't exist
      // Generate a random password (they'll use Google to log in)
      const randomPassword = Math.random().toString(36).slice(-16);
      const hashed = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          password: hashed,
          // Optional: save the Google profile picture as avatarUrl
          // avatarUrl: picture, 
        },
      });
    }

    // Issue your app's JWT (same as regular login)
    const token = signToken({ id: user.id, email: user.email });

    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
  console.error("Google auth error:", err.message, err);
  res.status(401).json({ message: `Invalid Google token: ${err.message}` });
}
};