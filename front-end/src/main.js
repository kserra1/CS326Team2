import EventHub from './eventhub/EventHub.js';
import RecipeService from './services/recipeservice.js';
import RecipeList from './components/recipelist/recipelist.js';
import MyRecipes from './components/myrecipes/myrecipes.js';
import Profile from './components/profile/profile.js';
import RecipeDetail from './components/recipedetail/recipedetail.js';

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
        snack: false
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
        snack: false
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
        snack: false
    },
]

const recipeService = new RecipeService();

async function addRecipesToDB(mockArr){
    for(const recipe of mockArr){
        try {
            await recipeService.addRecipe(recipe)
        } catch (error) {
            console.error("Error adding recipe:",error);
        }
    }
}
addRecipesToDB();

async function displayRecipes() {
    const recipeList = new RecipeList(recipeService);
    app.innerHTML = await recipeList.render();
}
document.getElementById('showRecipes').addEventListener('click', displayRecipes);
document.getElementById('showMyRecipes').addEventListener('click', ()=>{
    const myRecipes = new MyRecipes(recipeService);
    app.innerHTML = myRecipes.render();
});    
document.getElementById('showProfile').addEventListener('click', ()=>{
    const profile = new Profile();
    app.innerHTML = profile.render();
});

function render (){
    const hash = window.location.hash;
    const recipeIdMatch = hash.match(/#recipe\/(\d+)/);
    if (recipeIdMatch) {
        const recipeId = recipeIdMatch[1]; 
        const recipeDetail = new RecipeDetail(recipeService);
        app.innerHTML = recipeDetail.render(recipeId); 
    } else if (hash === '#my-recipes') {
        const myRecipes = new MyRecipes(recipeService);
        app.innerHTML = myRecipes.render(); 
    } else if (hash === '#profile') {
        const profile = new Profile();
        app.innerHTML = profile.render(); 
    } else {
        displayRecipes(); 
    }
}
window.addEventListener('hashchange', render);
render();

displayRecipes();