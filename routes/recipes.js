import express from 'express'
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.get('/', async(req, res)=>{
    try{
        const response = await RecipeModel.find({});
        res.json({recipes: response})     
    }catch (err){
        console.error(err);
    }
})

router.post("/", async (req, res)=>{
    try{
        const newRecipe = new RecipeModel(req.body);
        await newRecipe.save();
        res.json({newRecipe :newRecipe});
    }catch(err){
        console.error(err);
    }
})
//Save a recipe
router.put('/', async(req, res)=>{

    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        
        if (!user.savedRecipes.includes(recipe._id)) {
            user.savedRecipes.push(recipe);
            await user.save();
        }else{
            res.json("Recipe is Already Saved!")
        }
        
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        console.log(err);
    }
})
//Get id of saved recipes
router.get("/savedRecipes/ids/:userID", async(req,res)=>{
    try{
        const user = await UserModel.findById(req.params.userID);
        res.json({savedRecipes: user?.savedRecipes});
    }catch(err){
        console.error(err);
    }
})
//Get Saved Recipes
router.get("/savedRecipes/:userID", async(req,res)=>{
    try{
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id:{ $in: user.savedRecipes},                         //logical notation from mongodb doc which gets all the recipe ids from the RecipeModel that are saved in the user-model 
        });
        res.json(savedRecipes);
    }catch(err){
        console.error(err);
    }
})

export {router as RecipeRouter}