import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';
import { Recipe, mockRecipesObjs } from './recipe.js';
import Form from './components/form/form.js';
import AddRecipeComponent from './components/addrecipe/addrecipe.js';
import LoginPage from './components/loginpage/loginpage.js';
import { User } from './components/loginpage/user.js';

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

const form = new Form(eventHub, 'Profile.name()');
form.render()
document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    render();
});    

let currentuser = null;
const checkLoginState = async () =>{
    currentuser = await recipeService.getLoggedInUser();
}
document.getElementById('showProfile').addEventListener('click', ()=>{
    // const profile = new Profile();
    // app.innerHTML = profile.render();

    if(currentuser){
        const profile = new Profile(recipeService,currentuser);
        app.innerHTML = profile.render();
    }else{
        alert("Please log in to view your profile");
    }
});

eventHub.on("RecipeAdded", async(recipe)=>{
    try { 
        await recipeService.addRecipe(recipe);
        form.render()
        window.location.hash = '#my-recipes';
    }catch(error){
        console.error("Error adding recipe:", error);
    }
})


async function render (){
    await checkLoginState();
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
        if (currentuser) {
            const profile = new Profile(recipeService, currentuser);
            app.innerHTML = profile.render();
        } else {
            alert("Please log in to view your profile");
        }
    } else if (hash === '#community-recipes') {
      
        displayRecipes();
    } else if (hash === '#login') {
        if (currentuser) {
            alert("You are already logged in!");
            window.location.hash = '#profile';
            return;
        }
        const loginPage = new LoginPage(recipeService, async (user, ) => {
            currentuser = user; 
            alert("User registered/logged in successfully!");
            window.location.hash = '#profile'; 
        });
        app.innerHTML = loginPage.render();
        loginPage.addEventListeners();
    } else if (hash === '#add-recipe') {
        app.innerHTML = '';
        app.append(form.component);
    } else {
        displayRecipes(); 
    }
}

function updateNavigation(){
    //need to change the state of loginButton 
    //if the user is already logged in
    // id of button is showLogin

    //should also hide profile button until logged in
    const loginButton = document.getElementById('showLogin');
    const profileButton = document.getElementById('showProfile');

    if(currentuser){ //we are logged in already
        if(loginButton){
            loginButton.style.display = 'none';
        }
        if(profileButton){ //show the profile button
            profileButton.style.display = 'inline-block';
        }
    }else{ //we aren't logged in, so show login butotn
        if(loginButton){
            loginButton.style.display = 'inline-block';
        }
        if(profileButton){
            profileButton.style.display = 'none';
        }
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
document.getElementById('showAddRecipe').addEventListener('click', ()=>{
    window.location.hash = '#add-recipe';
});

document.getElementById('showLogin').addEventListener('click', () => {
    window.location.hash = '#login';
});

window.addEventListener('hashchange', render);
render();
