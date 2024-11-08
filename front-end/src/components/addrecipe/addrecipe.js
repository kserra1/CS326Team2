import { BaseComponent } from "../basecomponent/basecomponent.js";


export default class AddRecipeComponent extends BaseComponent{
constructor(recipeService, eventHub){
    super();
    this.recipeService = recipeService;
    this.loadCSS('addrecipe');
    this.eventHub = eventHub;
}

setupEventListeners(){
    const form = document.querySelector("#add-recipe-form");
    if(form){
        form.addEventListener("submit", this.handleAddRecipe.bind(this));
    }
}

async handleAddRecipe(event){
    console.log('Trying to add recipe');
    event.preventDefault();
    const name = document.querySelector('#recipe-name').value;
    const ingredients = document.querySelector("#recipe-ingredients").value;
    const instructions = document.querySelector("#recipe-instructions").value;
    const cookTime = parseInt(document.querySelector("#recipe-cookTime").value);
    const category = document.querySelector("#recipe-category").value;
    const breakfast = document.querySelector("#recipe-breakfast").checked;
    const lunch = document.querySelector("#recipe-lunch").checked;
    const dinner = document.querySelector("#recipe-dinner").checked;
    const snack = document.querySelector("#recipe-snack").checked;

    document.querySelector("#add-recipe-form").reset();

    try {
        const newRecipe = {
            name,
            ingredients: ingredients.split(",").map(i => i.trim()),
            instructions,
            cookTime,
            category,
            breakfast,
            lunch,
            dinner,
            snack,
            likes: 0,
            comments: []
        };
        this.eventHub.emit('RecipeAdded', newRecipe);
        document.querySelector("#add-recipe-form").reset();
        console.log("recipe added i thnink");
    } catch (error) {
        console.error("Error adding recipe:", error);
    }
}


async render() {
    this.innerHTML = `
      <div class="add-recipe-form">
        <h2>Add a New Recipe</h2>
        <form id="add-recipe-form">
          <label for="recipe-name">Name:</label>
          <input type="text" id="recipe-name" required />

          <label for="recipe-ingredients">Ingredients (comma-separated):</label>
          <input type="text" id="recipe-ingredients" required />

          <label for="recipe-instructions">Instructions:</label>
          <textarea id="recipe-instructions" required></textarea>

          <label for="recipe-cookTime">Cook Time (minutes):</label>
          <input type="number" id="recipe-cookTime" required />

          <label for="recipe-category">Category:</label>
          <input type="text" id="recipe-category" required />

          <div class="meal-times">
            <label><input type="checkbox" id="recipe-breakfast" /> Breakfast</label>
            <label><input type="checkbox" id="recipe-lunch" /> Lunch</label>
            <label><input type="checkbox" id="recipe-dinner" /> Dinner</label>
            <label><input type="checkbox" id="recipe-snack" /> Snack</label>
          </div>
          <button type="submit" id="add-recipe-button">Add Recipe</button>
        </form>
      </div>
    `;
    this.setupEventListeners();
    return this.innerHTML;
    }
}



