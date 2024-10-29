export default class RecipeService {
    constructor(recipes){
        this.recipes = recipes;
        let a = [];
    }


    addRecipes(recipe){
        this.recipes.push(recipe)
    }

    getRecipes(){
        return this.recipes;
    }

    getRecipeById(id){
        return this.recipes.find(recipe => recipe.id === parseInt(id));
    }

    getLength(){
        return this.recipes.length;
    }
}