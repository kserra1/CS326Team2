import ModelFactory from "../model/ModelFactory"

class RecipeController{
    constructor(){
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
    }

    //get all the recipes that this user have uploaded
    async getallrecipesfromuser(req, res, filter){
        if (!req.body.filter){
            recipe = await this.model.read();
        }else{
            recipe = await this.model.read(); //filter later
        }

        res.json({recipe});
    }

    //get the recipe for this current item (ie: chicken breast, get the recipe for this item)
    // async getthisRecipe(req, res){

    // }

    //get all the user information for profile

    //add a new recipe
    async addRecipe(req, res){
        
    }

    //delete recipes 
    async deletethisRecipe(req, res){

    }
}

export default new RecipeController();