import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';
import { Recipe, mockRecipesObjs } from './recipe.js';
import Form from './components/form/form.js';
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
        category: 'breakfast',
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
        category: 'lunch',
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
        category: 'dinner',
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
const mocks = mockRecipesObjs()
for(const m of mocks){
    const iter = m[Symbol.iterator]()
    for(const field of iter){
        console.log(field)
    }
}

const recipeService = new RecipeService(mockRecipes);

async function addRecipeToDB(recipe){
    await recipeService.addRecipe(recipe);
}

//addRecipeToDB(mockRecipeObj)

async function displayRecipes() {
    const recipeList = new RecipeList(recipeService, eventHub);
    app.innerHTML = await recipeList.render();
    recipeList.setupEventListeners();
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
document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    render();
});    
document.getElementById('showProfile').addEventListener('click', ()=>{
    const profile = new Profile();
    app.innerHTML = profile.render();
});
document.getElementById('showMakeRecipe').addEventListener('click', ()=>{
    const form = new Form('Profile.name()');
    app.innerHTML = ''
    app.append(form.render());
});

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



document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    window.location.hash = '#my-recipes';
});
document.getElementById('showProfile').addEventListener('click', ()=>{
    window.location.hash = '#profile';
});


window.addEventListener('hashchange', render);
render();