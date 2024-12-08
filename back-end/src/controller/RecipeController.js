import ModelFactory from "../model/ModelFactory.js"

class RecipeController{
    constructor(){
        ModelFactory.getModel('recipe-model').then((model) => {
            this.model = model;
        });
    }

    //get all the recipes that this user have uploaded
    async GetAllRecipesFromUser(req, res){
        try {

            const author = req.params.id;
            const recipes = await this.model.read({author: author});
            res.json({recipes: user_recipes});

        }catch(error){
            console.error("Error fetching user recipes:", error);
            res.status(500).json({error: "Error fetching user recipes"});
        }
    }

    //get recipes for all the user that have ever made a recipes (used to display at the community page)
    //a public recipe get for all to see
    async GetAllRecipesFromAllUsers(req, res){
        try{
            const recipes = await this.model.read();
            res.json({recipes});
        }catch (error){
            console.error("Error fetching all recipes:", error);
            res.status(500).json({error: "Error fetching all recipes"});
        }
    }

    //get the recipe for this current item (ie: chicken breast, get the recipe for this item)
    //a search function to get a particular recipe that you want
    async GetThisRecipe(req, res){
        try{
            const user_recipe = await this.model.read({title: req.params.id});
            if(!user_recipe){
                return res.status(404).json({error: "No Recipe found"});
            }
            
            res.json({user_recipe});
        }catch (error){
            console.error("Error fetching recipe:", error);
            res.status(500).json({ error: "Error fetching recipe" });
        }
    }

    //add a new recipe
    async AddRecipe(req, res){
        try{
            console.log("title", req.body.title)
            if (!req.body.title || !req.body.author || !req.body.ingredients || !req.body.instructions) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const newRecipe = await this.model.create(req.body);

            res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
        }catch (error){
            console.error("Error adding recipe:", error);
            res.status(500).json({error: "Error adding recipe"});
        }
    }

    //delete recipes 
    async deleteThisRecipe(req, res){
        try{
            const recipeId = req.params.id; //assume the id is passed in the url
            console.log(recipeId)
            const recipe = await this.model.read({id: recipeId});
            if (!recipe) {
                return res.status(404).json({ error: "Recipe not found" });
            }

            if (recipe.user_id !== req.user.username) {
                return res.status(403).json({ error: "You are not authorized to delete this recipe" });
            }

            await this.model.delete(recipe);
            res.json({ message: "Recipe deleted successfully" });
        }catch (error){
            console.error("Error deleting recipe:", error);
            res.status(500).json({ error: "Error deleting recipe" });
        }
    }
}

export default new RecipeController();