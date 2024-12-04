import express from "express";
import UserController from "../controller/UserController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
//Contains routes for whole application
class RecipeRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    //Define the routes and connect them to controller methods
    initializeRoutes(){
        this.router.get("/recipes", authenticateToken,  async (req, res) => {
            //Will have recipe controller but mock for now:
            await res.json({recipes: []});
        });
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