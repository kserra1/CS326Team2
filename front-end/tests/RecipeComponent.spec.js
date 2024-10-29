//these are tests for recipes in components folder
import assert from "node:assert";
import RecipeDetail from "../src/components/recipedetail/recipedetail";
import RecipeList from "../src/components/recipelist/recipelist";
import RecipeService from "../src/services/recipeservice";

const service = new RecipeService([]); //RecipieService object

describe('RecipeService', () => {
    it("should keep track of recipe's properly", ()=>{
        const mockRecipe = {
            id: 1,
            name: 'Pancakes',
            ingredients: ['flour', 'eggs', 'milk', 'butter'],
            instructions: 'Mix ingredients together and cook on griddle',
            cookTime: 15,
            category: 'breakfast'
        };
        service.addRecipes(mockRecipe);
        assert(service.getLength() === 1, "the length should be 1 after adding a recipe");
    });
});