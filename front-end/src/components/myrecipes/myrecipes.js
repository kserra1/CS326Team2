import { BaseComponent } from "../basecomponent/basecomponent.js";

export default class MyRecipes extends BaseComponent{
  constructor(recipeService) {
    super();
    this.recipeService = recipeService;
    this.MyRecipes = [];
    this.loadCSS('recipelist')
    this.recipeService.eventHub.on("RecipeAdded",()=>{
      this.render();
    });
  }


  async render() {
    // Display a loading message until recipes are fetched
    const loadingMessage = `<div class="loading">Loading your recipes...</div>`;
    this.innerHTML = loadingMessage;
    try {
      // Fetch recipes from the service
      const recipes = await this.recipeService.getAllRecipes();
      // Once recipes are loaded, render the list
      this.innerHTML = `
                  <div class="recipe-list">
                      <h2>Your Recipes</h2>
                      <ul>
                          ${recipes
                            .map(
                              (recipe) => `
                              <li>
                                  <a href="#recipe/${recipe.id}">${recipe.title}</a>
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
    return this.innerHTML;
  }
}
