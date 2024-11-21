import express from "express";

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
    }

    getRouter(){
        return this.router;
    }   

}

export default new RecipeRoutes().getRouter();