/*
Recipe type:
    {
        id: 1,
        name: 'Pancakes',
        ingredients: ['flour', 'eggs', 'milk', 'butter'],
        instructions: 'Mix ingredients together and cook on griddle',
        cookTime: 15,
        category: 'breakfast',
        breakfast: true,
        lunch: false,
        dinner: false,
        snack: false
    },
*/
import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class RecipeDetail extends BaseComponent {
    constructor(recipeService){
        super();
        this.recipeService = recipeService;
        this.loadCSS('recipedetail');
    }

    async render(recipeId) {
        const recipe = await this.recipeService.getRecipeById(recipeId); 
        if (!recipe) {
            return `<h2>Recipe not found!</h2>`;
        }

        return `
        <div class="recipe-detail">
            <h2>${recipe.name}</h2>
            <h3>Ingredients</h3>
            <ul>
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient}</li>
                `).join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${recipe.instructions}</p>
            <h3>Cook Time</h3>
            <p>${recipe.cookTime} minutes</p>
            <h3>Category</h3>
            <p>${recipe.category}</p>
            <h3>Meal Type</h3>    
            <a href="#community-recipes">Back to Recipes</a>
        </div>
        `;
    }
}
