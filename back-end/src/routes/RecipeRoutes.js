import express from "express";
import UserController from "../controller/UserController.js";

class RecipeRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.get("/recipes", async (req, res) => {
            //Will have recipe controller but mock for now:
            await res.json({recipes: []});
        });
        this.router.post("/register", async (req, res)=>{
            await UserController.register(req, res);
        });
        this.router.post("/login",  async (req, res)=>{
            await UserController.login(req, res);
        });
    }

    getRouter(){
        return this.router;
    }   

}

export default new RecipeRoutes().getRouter();