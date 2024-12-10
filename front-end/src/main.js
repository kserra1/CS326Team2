import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';
import Form from './components/form/form.js';
import AddRecipeComponent from './components/addrecipe/addrecipe.js';
import LoginPage from './components/loginpage/loginpage.js';
import { User } from './components/loginpage/user.js';

const app = document.getElementById('app');
const eventHub = new EventHub();
const recipeService = new RecipeService();

const response = await fetch('http://localhost:3260/v1/recipe')
let res
try{
    res = await response.json()
    console.log("Successfully got initial recipes:", res)
}catch(e){
    console.log("Couldn't get initial recipes:", e)
}
recipeService.loadRecipes(res.recipes)

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
    console.log("addComment")
    if (!comment.user){
        console.log("Must be logged in to comment");
        return;
    }
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
    const token = localStorage.getItem('authToken');
    if(token){
        try{
            const response = await fetch('http://localhost:3260/v1/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if(!response.status === 201){
                throw new Error('Failed to fetch user profile');
            }
            const data = await response.json();
            currentuser = {
                username: data.username,
                email: data.email,
                token: token
            }
            //currentuser = await recipeService.getLoggedInUser();

        }catch (error) {
            console.error('Failed to fetch user profile:', error);

        }
    }else{
        currentuser = null;
    }
}
document.getElementById('showProfile').addEventListener('click', ()=>{
    // const profile = new Profile();
    // app.innerHTML = profile.render();

    if(currentuser){
        const profile = new Profile(recipeService,currentuser);
        profile.init();
        app.innerHTML = profile.render();
        profile.setupEventListeners();
    }else{
        alert("Please log in to view your profile");
    }
});

eventHub.on("RecipeAdded", async(recipe)=>{
    
    const recipeData = await recipe

    const response = await fetch('http://localhost:3260/v1/recipe', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData)
    })
    let res
    try{
        res = await response.json()
        console.log("Successfully put recipe:", res)
    }catch(e){
        console.log("Couldn't put recipe:", e)
    }
    if(res.recipe){
        console.log("res.recipe: ",res.recipe)  
        await recipeService.addRecipe(res.recipe);
    } else 
        console.log("res: ", res)  
        
    form.render()
    window.location.hash = '#my-recipes';
})




async function render (){
    await checkLoginState();
    updateNavigation(); //default is to show login
    const hash = window.location.hash;
    const recipeIdMatch = hash.match(/^#recipe\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    app.innerHTML = '';

    Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .filter(link=> link.getAttribute("href") !== "main.css")
    .forEach(link => {
        link.parentNode.removeChild(link);
    })
    console.log(document.querySelectorAll('link[rel="stylesheet"]'))
    if (recipeIdMatch) {
        console.log(recipeIdMatch)
        const recipeId = recipeIdMatch[1]
        console.log(recipeId)
        const recipeDetail = new RecipeDetail(recipeService);
        app.innerHTML = await recipeDetail.render(recipeId);
    } else if (hash === '#my-recipes') {
        const myRecipes = new MyRecipes(recipeService, currentuser);
        app.innerHTML = await myRecipes.render();
        myRecipes.setupEventListeners();
    } else if (hash === '#profile') {
        if (currentuser) {
            const profile = new Profile(recipeService, currentuser);
            app.innerHTML = profile.render();
            profile.setupEventListeners();
        } else {
            alert("Please log in to view your profile");
        }
    } else if (hash === '#community-recipes') {
      
        displayRecipes();
    } else if (hash === '#login') {
        const loginPage = new LoginPage(recipeService, async (user, ) => {
            currentuser = user; 
            updateNavigation();
            window.location.hash = '#community-recipes'; 
        });
        app.innerHTML = loginPage.render();
        loginPage.addEventListeners();
    } else if (hash === '#add-recipe') {
        const form = new Form(eventHub, currentuser.username);
        form.render()
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
    const logoutButton = document.getElementById('logoutButton');
    const myRecipesButton = document.getElementById('showMyRecipes');
    const addRecipeButton = document.getElementById('showAddRecipe');
    if(currentuser){ //we are logged in already
        if(loginButton){
            loginButton.style.display = 'none';
        }
        if(profileButton){ //show the profile button
            profileButton.style.display = 'inline-block';
        }
        if(logoutButton){
            logoutButton.style.display = 'inline-block';
        }
        if(myRecipesButton){
            myRecipesButton.style.display = 'inline-block';
        }
        if(addRecipeButton){
            addRecipeButton.style.display = 'inline-block';
        }
    }else{ //we aren't logged in, so show login butotn
        if(loginButton){
            loginButton.style.display = 'inline-block';
        }
        if(profileButton){
            profileButton.style.display = 'none';
        }
        if(logoutButton){
            logoutButton.style.display = 'none';
        }
        if(myRecipesButton){
            myRecipesButton.style.display = 'none';
        }
        if(addRecipeButton){
            addRecipeButton.style.display = 'none';
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
        const curUser = await this.recipeService.getLoggedInUser();
        await recipeService.addComment(recipeId, { user: curUser, text: commentText });
        recipe.comments.push({ user: curUser, text: commentText }); // Update local comments array
        const recipeList = new RecipeList(recipeService, eventHub);
        input.value = ""; // Clear input
    }
}



document.getElementById('showRecipes').addEventListener('click', ()=>{
    window.location.hash = '#community-recipes';
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
