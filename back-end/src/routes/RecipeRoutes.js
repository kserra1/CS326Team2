import express from "express";
import UserController from "../controller/UserController.js";
import RecipeController from "../controller/RecipeController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
//Contains routes for whole application
class RecipeRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    //Define the routes and connect them to controller methods
    initializeRoutes(){
        this.router.get("/recipe/title/:id", async (req, res) => {
            RecipeController.GetThisRecipe(req, res)
            console.log('recipe get this!')
        })
        this.router.get("/recipe/user/:id", async (req, res) => {
            RecipeController.GetAllRecipesFromUser(req, res)
            console.log('recipe get from user!')
        })
        this.router.get("/recipe", async (req, res) => {
            RecipeController.GetAllRecipesFromAllUsers(req, res)
            console.log('recipe get all!')
        })
        this.router.get("/recipe", async (req, res) => {
            RecipeController.GetAllRecipesFromAllUsers(req, res)
            console.log('recipe get all!')
        })
        this.router.post("/recipe", async (req, res) => {
            console.log('recipe post!')
            RecipeController.AddRecipe(req, res)
        })
        this.router.delete("/recipe/:id", async (req, res) => {
            await RecipeController.deleteThisRecipe(req, res)
            console.log('recipe deleted!')
        })
        this.router.delete("/recipe", async (req, res) => {
            await RecipeController.deleteThisRecipe(req, res)
            console.log('recipe deleted!')
        })
        //Get profile info:
        this.router.get("/profile", authenticateToken, UserController.getUserInfo.bind(UserController));
        //Register a new user
        this.router.post("/register", async (req, res)=>{
            await UserController.register(req, res);
        });
        //Login a user
        this.router.post("/login",  async (req, res)=>{
            await UserController.login(req, res);
        });
    }

    getRouter(){
        return this.router;
    }   

}

export default new RecipeRoutes().getRouter();