import { BaseComponent } from "../basecomponent/basecomponent.js";
export default class RecipeList extends BaseComponent {
  constructor(recipeService, eventHub) {
    super();
    this.recipeService = recipeService;
    this.loadCSS("recipelist");
    this.eventHub = eventHub;
  }



  async render() {
    const recipes = await this.recipeService.getAllRecipes();
    return `
        <div class="recipe-list">
            <h2>Community Recipes</h2>
            <div class="search-bar">
                <input type="text" id="ingredientSearch" placeholder="Search by ingredients..." />
                <select id="categoryFilter">
                    <option value="">All Cuisines</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                </select>
                <button id="searchButton">Search</button>
            </div>
            <ul id="recipeList">
                ${recipes.map(recipe => this.renderRecipe(recipe)).join('')}
            </ul>
            <input id="load_more" type="button" value="Load More">
        </div>
    `;
  }

  renderRecipe(recipe) {
    console.log("rendering: ", recipe)
    return `
        <li data-id="${recipe.id}">
            <h3><a href="#recipe/${recipe.id}">${recipe.title}</a></h3>
            <ul>
                ${recipe.ingredients.map(ingredient => `
                    <li>${ingredient.item}</li>
                `).join(' ')}
            </ul>
            <button data-id="${recipe.id}" class="like-btn">❤️ ${recipe.likes}</button>
            <h4>Comments</h4>
            <ul class="comments">
                ${this.renderComments(recipe.comments)}
            </ul>
            <input type="text" placeholder="Add a comment..." class="comment-input" data-id="${recipe.id}" />
            <button data-id="${recipe.id}" class="add-comment-btn">Add Comment</button>
        </li>
    `;
  }

  renderComments(comments) {
    return comments.map(comment => `<li><strong>${comment.user+" :"}</strong> ${comment.text}</li>`).join('');
  }

setupEventListeners() {

  document.querySelector('#searchButton').addEventListener('click', async () => {
    const category = document.querySelector('#categoryFilter').value;
    //Lowercase, and trim so that it can search properly
    const ingredients = document.querySelector('#ingredientSearch').value.split(',').map(i => i.trim().toLowerCase());

    const filteredRecipes = await this.recipeService.searchRecipes({
        category,
        //No empty strs
        ingredients: ingredients.filter(i => i) 
    });
    document.querySelector('#recipeList').innerHTML = filteredRecipes.map(recipe => this.renderRecipe(recipe)).join('');
});

  // Attach event listeners for like and comment buttons
  document.querySelectorAll('.like-btn').forEach((button) => {
      button.addEventListener('click', this.handleLike.bind(this));
  });
  document.querySelectorAll('.add-comment-btn').forEach((button) => {
      button.addEventListener('click', this.handleAddComment.bind(this));
  });

  document.getElementById('load_more').addEventListener('click', async()=>{
    const response = await fetch('http://localhost:3260/v1/recipe', {
        method: "GET",
    })
    let res
    try{
        res = await response.json()
        console.log("Successfully got recipe:", res)
    }catch(e){
        console.log("Couldn't put recipe:", e)
    }
        
    await res.recipes.map(async e=> await this.recipeService.addRecipe(e)) ;
    this.render()
})
}

handleLike(event) {
  const recipeId = event.target.dataset.id;
  // Emit event for the like action
  this.eventHub.emit('likeRecipe', recipeId);
}

async handleAddComment(event) {
  const recipeId = event.target.dataset.id;
  const input = document.querySelector(`.comment-input[data-id="${recipeId}"]`);
  const commentText = input.value.trim();
  if (commentText) {
      // Emit event for the add comment action
      const curUser = await this.recipeService.getLoggedInUser();
      if(!curUser) {
        this.eventHub.emit('addComment', {recipeId, comment: {}});
        return;
      }

      console.log(curUser)
      this.eventHub.emit('addComment', { recipeId, comment: { user: curUser.username, text: commentText } });
      input.value = ""; // Clear input field after adding the comment
  }
}



}
