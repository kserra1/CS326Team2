export default class MyRecipes {
    constructor(recipeService){
        this.recipeService = recipeService;
        this.MyRecipes = [];
    }

    render(){
        return `
        <h2>My Recipes</h2>
            <ul>
                ${this.MyRecipes.map(recipe => `
                    <li>
                        <a href="#recipe/${recipe.id}">${recipe.name}</a>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}