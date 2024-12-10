import { Recipe } from "./recipe.js"
const { faker } = await import('https://esm.sh/@faker-js/faker')

export async function fakeRecipe(user = null) { 
    //faker = await faker
    const recipe = new Recipe()
    recipe.title = faker.food.dish()
    recipe.author = user ? user : faker.internet.username()
    recipe.cookTime = { hours: faker.number.int(24), minutes: faker.number.int(60) }
    recipe.prepTime = { hours: faker.number.int(24), minutes: faker.number.int(60) }
    recipe.difficulty = faker.number.float(5)
    recipe.description = faker.food.description()
    recipe.breakfast = faker.datatype.boolean()
    recipe.lunch = faker.datatype.boolean()
    recipe.dinner = faker.datatype.boolean()
    recipe.snack = faker.datatype.boolean()
    recipe.categories = [...Array(faker.number.int(10))].map(_=>faker.food.ethnicCategory())
    recipe.image = new File([], '')
    recipe.ingredients = [...Array(faker.number.int(10))].map(_=>{
        return {
            item: faker.food.ingredient(),
            amount: faker.number.int(10),
            unit: 'Ounces',
        }
    }),
    recipe.cookware = [...Array(faker.number.int(10))].map(_=>faker.commerce.product())
    recipe.instructions = [...Array(faker.number.int(10))].map(_=>faker.food.adjective())
    recipe.comments = [...Array(faker.number.int(10))].map(_=>{
        return {
            user: faker.internet.username(),
            text: faker.internet.emoji(),
            like: faker.datatype.boolean(),
            difficulty: faker.number.float(5),
        }
    }),
    recipe.likes = faker.number.int(100)
    return recipe
}
export function fakeUser() {
    return {
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
    }
}