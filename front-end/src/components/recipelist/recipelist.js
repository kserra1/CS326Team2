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
            <ul>
                ${recipes.map(recipe => this.renderRecipe(recipe)).join('')}
            </ul>
        </div>
    `;
  }

  renderRecipe(recipe) {
    console.log("rendering: ", recipe)
    return `
        <li data-id="${recipe.id}">
            <h3>${recipe.name}</h3>
            <p>${recipe.instructions}</p>
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
    return comments.map(comment => `<li><strong>${comment.user}</strong>: ${comment.text}</li>`).join('');
  }

setupEventListeners() {
  // Attach event listeners for like and comment buttons
  document.querySelectorAll('.like-btn').forEach((button) => {
      button.addEventListener('click', this.handleLike.bind(this));
  });
  document.querySelectorAll('.add-comment-btn').forEach((button) => {
      button.addEventListener('click', this.handleAddComment.bind(this));
  });
}

handleLike(event) {
  const button = event.target;
  const recipeId = parseInt(button.getAttribute("data-id"), 10);
  // Emit event for the like action
  this.eventHub.emit('likeRecipe', recipeId);
}

handleAddComment(event) {
  const button = event.target;
  const recipeId = parseInt(button.getAttribute("data-id"), 10);
  const input = document.querySelector(`.comment-input[data-id="${recipeId}"]`);
  const commentText = input.value.trim();
  if (commentText) {
      // Emit event for the add comment action
      this.eventHub.emit('addComment', { recipeId, comment: { user: "User1", text: commentText } });
      input.value = ""; // Clear input field after adding the comment
  }
}



}
