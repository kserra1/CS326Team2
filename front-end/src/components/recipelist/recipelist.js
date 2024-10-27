import { BaseComponent } from "../basecomponent/basecomponent.js";

export default class RecipeList extends BaseComponent{
    constructor(recipeService){
        super();
        this.recipeService = recipeService;
        this.loadCSS('recipelist')
    }

    render(){
        const recipes = this.recipeService.getRecipes();
        return `
        <div class="recipe-list">
        <h2>Community Recipes</h2>
            <ul>
                ${recipes.map(recipe => `
                    <li>
                        <a href="#recipe/${recipe.id}">${recipe.name}</a>
                    </li>
                `).join('')}
            </ul>
        </div>
        `;
    }
}