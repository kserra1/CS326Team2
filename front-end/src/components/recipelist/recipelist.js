import { BaseComponent } from "../basecomponent/basecomponent.js";

export default class RecipeList extends BaseComponent {
  constructor(recipeService) {
    super();
    this.recipeService = recipeService;
    this.loadCSS("recipelist");
  }

  async render() {
    // Display a loading message until recipes are fetched
    const loadingMessage = `<div class="loading">Loading recipes...</div>`;
    this.innerHTML = loadingMessage;

    try {
      // Fetch recipes from the service
      const recipes = await this.recipeService.getAllRecipes();

      // Once recipes are loaded, render the list
      this.innerHTML = `
                <div class="recipe-list">
                    <h2>Community Recipes</h2>
                    <ul>
                        ${recipes
                          .map(
                            (recipe) => `
                            <li>
                                <a href="#recipe/${recipe.id}">${recipe.name}</a>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            `;
    } catch (error) {
      // Handle any errors in fetching data
      this.innerHTML = `<div class="error">Failed to load recipes.</div>`;
      console.error("Error loading recipes:", error);
    }
  }
}
