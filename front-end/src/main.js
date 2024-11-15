import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';
import AddRecipeComponent from './components/addrecipe/addrecipe.js';
import LoginPage from './components/loginpage/loginpage.js';
import { User } from './components/loginpage/user.js';

const app = document.getElementById('app');
const eventHub = new EventHub();
//Should have id, name, ingredients, instructions, cook time, category, and breakfast, lunch, dinner, and snack booleans
const mockRecipes = [
    {
        id: 1,
        name: 'Pancakes',
        ingredients: ['flour', 'eggs', 'milk', 'butter'],
        instructions: 'Mix ingredients together and cook on griddle',
        cookTime: 15,
        category: 'American',
        breakfast: true,
        lunch: false,
        dinner: false,
        snack: false,
        comments: [{user: 'John', text: 'These are great pancakes!'}, {user: 'Jane', text: 'I love these pancakes!'
            }],
        likes: 0
    },
    {
        id: 2,
        name: 'Grilled Cheese',
        ingredients: ['bread', 'cheese', 'butter'],
        instructions: 'Butter bread, put cheese between slices, cook on griddle',
        cookTime: 10,
        category: 'American',
        breakfast: false,
        lunch: true,
        dinner: false,
        snack: false,
        comments: [{
            user: 'John', text: 'This is a great grilled cheese recipe!'
        }],
        likes: 0
    },
    {
        id: 3,
        name: 'Spaghetti',
        ingredients: ['pasta', 'sauce', 'meatballs'],
        instructions: 'Boil pasta, heat sauce and meatballs, serve together',
        cookTime: 30,
        category: 'Italian',
        breakfast: false,
        lunch: false,
        dinner: true,
        snack: false,
        comments: [{
            user: 'Jane', text: 'I love spaghetti!'
        }],
        likes: 35
    },
]

const recipeService = new RecipeService(mockRecipes);

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
document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    render();
});    

let currentuser = null;
document.getElementById('showProfile').addEventListener('click', ()=>{
    // const profile = new Profile();
    // app.innerHTML = profile.render();

    if(currentuser){
        const profile = new Profile(currentuser);
        app.innerHTML = profile.render();
    }else{
        alert("Please log in to view your profile");
    }
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
        // const profile = new Profile();
        // app.innerHTML = await profile.render();
        if (currentuser) {
            const profile = new Profile(currentuser);
            app.innerHTML = await profile.render();
        } else {
            alert("Please log in to view your profile");
        }
    }else if (hash === '#login') { //login
        // const loginPage = new LoginPage();
        // app.innerHTML = loginPage.render();
        // loginPage.addEventListeners();
        const loginPage = new LoginPage((user) => {
            currentuser = user; 
            alert("User registered/logged in successfully!");
            window.location.hash = '#profile'; 
        });
        app.innerHTML = loginPage.render();
        loginPage.addEventListeners();
    } else if (hash === '#add-recipe') {
        addRecipeC();
    } else {
        displayRecipes(); 
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

document.getElementById('showLogin').addEventListener('click', () => {
    window.location.hash = '#login';
});

window.addEventListener('hashchange', render);
render();
