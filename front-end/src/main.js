import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';
import { Recipe, mockRecipesObjs } from './recipe.js';
import Form from './components/form/form.js';
import AddRecipeComponent from './components/addrecipe/addrecipe.js';
const app = document.getElementById('app');
const eventHub = new EventHub();

console.log(mockRecipesObjs())
const recipeService = new RecipeService(mockRecipesObjs());

async function addRecipeToDB(recipe){
    await recipeService.addRecipe(recipe);
}


eventHub.on('likeRecipe', async (recipeId) => {
    const recipe = await recipeService.getRecipeById(recipeId);
    if (recipe) {
        await recipeService.updateLikes(recipeId, recipe.likes + 1);
        recipe.likes += 1; // Update local likes count
        const recipeList = new RecipeList(recipeService, eventHub);
        const recipeElement = document.querySelector(`button[data-id="${recipeId}"]`);
        recipeElement.innerHTML = `❤️ ${recipe.likes}`;
    }
});
eventHub.on('addComment', async ({ recipeId, comment }) => {
    await recipeService.addComment(recipeId, comment);
    const recipeList = new RecipeList(recipeService, eventHub);
    const recipe = await recipeService.getRecipeById(recipeId);
    //Update the comment list the same way we update the likes
    const recipeElement = document.querySelector(`li[data-id="${recipeId}"]`);
    if(recipeElement){
        recipeElement.querySelector('.comments').innerHTML = recipeList.renderComments(recipe.comments);
    }
});

async function displayRecipes() {
    const recipeList = new RecipeList(recipeService, eventHub);
    app.innerHTML = await recipeList.render();
    recipeList.setupEventListeners();
}
async function addRecipeC(){
    const addRecipeComponent = new AddRecipeComponent(recipeService, eventHub);
    app.innerHTML = await addRecipeComponent.render();
    addRecipeComponent.setupEventListeners();
}

const form = new Form('Profile.name()');
document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    render();
});    
document.getElementById('showProfile').addEventListener('click', ()=>{
    const profile = new Profile();
    app.innerHTML = profile.render();
});
document.getElementById('showMakeRecipe').addEventListener('click', ()=>{
    app.innerHTML = ''
    app.append(form.render());
});

eventHub.on("RecipeAdded", async(recipe)=>{
    try { 
        await recipeService.addRecipe(recipe);
        window.location.hash = '#my-recipes';
    }catch(error){
        console.error("Error adding recipe:", error);
    }
})


async function render (){
    const hash = window.location.hash;
    const recipeIdMatch = hash.match(/#recipe\/(\d+)/);
    app.innerHTML = '';
    if (recipeIdMatch) {
        const recipeId = parseInt(recipeIdMatch[1], 10);
        const recipeDetail = new RecipeDetail(recipeService);
        app.innerHTML = await recipeDetail.render(recipeId);
    } else if (hash === '#my-recipes') {
        const myRecipes = new MyRecipes(recipeService);
        app.innerHTML = await myRecipes.render();
    } else if (hash === '#profile') {
        const profile = new Profile();
        app.innerHTML = await profile.render();
    } else if (hash === '#community-recipes') {
        displayRecipes(); 
    } else if (hash === '#add-recipe') {
        addRecipeC();
    }
}


async function handleLike(event) {
    const button = event.target;
    const recipeId = parseInt(button.getAttribute("data-id"), 10);
    const recipe = await recipeService.getRecipeById(recipeId);
    if (recipe) {
        await recipeService.updateLikes(recipeId, recipe.likes + 1);
        recipe.likes += 1; // Update local likes count
        const recipeList = new RecipeList(recipeService, eventHub);
    }
}
async function handleAddComment(event) {
    const button = event.target;
    const recipeId = parseInt(button.getAttribute("data-id"), 10);
    const recipe = await recipeService.getRecipeById(recipeId);
    const input = document.querySelector(`.comment-input[data-id="${recipeId}"]`);
    const commentText = input.value.trim();
    if (commentText) {
        await recipeService.addComment(recipeId, { user: "User1", text: commentText });
        recipe.comments.push({ user: "User1", text: commentText }); // Update local comments array
        const recipeList = new RecipeList(recipeService, eventHub);
        input.value = ""; // Clear input
    }
}



document.getElementById('showRecipes').addEventListener('click', ()=>{
    window.location.hash = '#community-recipes';
    console.log('test')
    displayRecipes();
});
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    window.location.hash = '#my-recipes';
});
document.getElementById('showProfile').addEventListener('click', ()=>{
    window.location.hash = '#profile';
});
document.getElementById('showAddRecipe').addEventListener('click', ()=>{
    window.location.hash = '#add-recipe';
});


window.addEventListener('hashchange', render);
render();
