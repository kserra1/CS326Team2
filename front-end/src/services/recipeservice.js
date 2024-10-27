export default class RecipeService {
    constructor(recipes){
        this.recipes = recipes;
    }

    getRecipes(){
        return this.recipes;
    }

    getRecipeById(id){
        return this.recipes.find(recipe => recipe.id === parseInt(id));
    }
}