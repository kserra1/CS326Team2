import { Recipe } from "./recipe.js"
const { faker } = await import('https://esm.sh/@faker-js/faker')

export async function fakeRecipe(user = null) { 
    //faker = await faker
    return {
        title: faker.food.dish(),
        author: user ? user.username : faker.internet.username(),
        date: new Date().toString(),
        lastUpdated: new Date().toString(),
        cookTime: { hours: faker.number.int(24), minutes: faker.number.int(60) },
        prepTime: { hours: faker.number.int(24), minutes: faker.number.int(60) },
        difficulty: faker.number.   float(5),
        description: faker.food.description(),
        breakfast: faker.datatype.boolean(),
        lunch: faker.datatype.boolean(),
        dinner: faker.datatype.boolean(),
        snack: faker.datatype.boolean(),
        categories: [...Array(faker.number.int(10))].map(e=>faker.food.ethnicCategory()),
        image: new File([], ''),
        ingredients: [...Array(faker.number.int(10))].map(e=>faker.food.ingredient()),
        cookware: [...Array(faker.number.int(10))].map(e=>faker.commerce.product()),
        instructions: [...Array(faker.number.int(10))].map(e=>faker.food.adjective()),
        comments: [...Array(faker.number.int(10))].map(e=>faker.internet.emoji()),
        likes: faker.number.int(100),
    }
}
export function fakeUser() {
    return {
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
    }
}