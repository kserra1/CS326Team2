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
            return `<h2>Recipe not found!${recipeId}</h2>`;
        }
        console.log(recipe)
        return `
        <div class="recipe-detail">
            <h2>${recipe.title}</h2>
            <h3>Ingredients</h3>
            <ul>
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient.item}</li>
                `).join(' ')}
            </ul>
            <h3>Instructions</h3>
            <ul>
                ${recipe.instructions.map(instruction => `
                    <li>${instruction}</li>
                `).join(' ')}
            </ul>
            <h3>Cook Time</h3>
            <p>${recipe.cookTime.hours === 0 ? ' ' : recipe.cookTime.hours + ' hour(s)'} 
            ${recipe.cookTime.minutes === 0 ? ' ' : recipe.cookTime.minutes + 'minute(s)'}</p>
            <h3>Cuisine</h3>
            <p>${recipe.categories.join(', ')}</p>
            <h3>Meal Type</h3>    
            <p>${recipe.breakfast ? 'Breakfast' : ''}</p>
            <p>${recipe.lunch ? 'Lunch' : ''}</p>
            <p>${recipe.dinner ? 'Dinner' : ''}</p>
            <p>${recipe.snack ? 'Snack' : ''}</p>
            <a href="#community-recipes">Back to Recipes</a>
        </div>
        `;
    }
}
