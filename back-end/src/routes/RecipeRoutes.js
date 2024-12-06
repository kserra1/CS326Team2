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
        this.router.route("/recipe")
            .get(async (req, res) => {
                console.log('recipe get!')
            })
            .post(async (req, res) => {
                console.log('recipe post!')
                res.json(({pussy:0}))
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