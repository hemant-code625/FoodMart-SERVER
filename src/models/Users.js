import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{type: String, required:true, unique: true},
    password:{type: String, required:true},
    savedRecipes:[{type: mongoose.Schema.Types.ObjectId, ref: "recipes", require: true}]
})

export const UserModel = mongoose.model("users",userSchema);
