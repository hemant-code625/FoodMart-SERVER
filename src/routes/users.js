import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../models/Users.js";


router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, `${process.env._SecretToken}`);
  res.json({ token, userID: user._id });
});


router.get("/user-exists/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username });
  res.json({ exists: !!user });
});


export { router as UserRouter };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, `${process.env._SecretToken}`, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// When a user logs in, they typically receive a token that proves their identity. 
// While your login and registration processes might ensure that only legitimate users get tokens, this middleware further ensures that someone with a valid token can access specific protected parts of your application. 
// This extra layer of protection prevents unauthorized users from accessing sensitive data or functionality.