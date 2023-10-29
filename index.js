import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"; 

import {UserRouter} from './routes/users.js'
import { RecipeRouter } from "./routes/recipes.js";
const app = express();

dotenv.config(); 

app.use(express.json());
app.use(cors({
  origin: ["https://foodmart-server.vercel.app"],
  methods: ["POST", "GET", "PUT"],
  credentials: true
}));

app.use("/auth",UserRouter);
app.use("/recipes", RecipeRouter);

app.get('/', (req,res)=>{
  res.json("Server is up! Get recipe api by navigating to /recipes");
})

mongoose.connect(`mongodb+srv://food-wiki:${process.env.DB_PASS}@cluster0.rpxjdx4.mongodb.net/food-wiki`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB: ", error);
});

app.listen(3001, () => {
    console.log("Server started!");
});
