import { Recipe } from "./recipe.js"
import { faker } from "faker"

export function fakeRecipe(user = null) { 
    return {
        title: faker.food.dish(),
        author: user ? user.username : faker.internet.username(),
        date: new Date().toString(),
        lastUpdated: new Date().toString(),
        cookTime: { hours: faker.int(24), minutes: faker.int(60) },
        prepTime: { hours: faker.int(24), minutes: faker.int(60) },
        difficulty: faker.float(5),
        description: faker.food.description(),
        breakfast: faker.datatype.boolean(),
        lunch: faker.datatype.boolean(),
        dinner: faker.datatype.boolean(),
        snack: faker.datatype.boolean(),
        categories: [...Array(faker.int(10))].map(e=>faker.food.ethnicCategory()),
        image: new File([], ''),
        ingredients: [...Array(faker.int(10))].map(e=>faker.food.ingredient()),
        cookware: [...Array(faker.int(10))].map(e=>faker.commerce.product()),
        instructions: [...Array(faker.int(10))].map(e=>faker.food.adjective()),
        comments: [...Array(faker.int(10))].map(e=>faker.internet.emoji()),
        likes: faker.int(100),
    }
}
export function fakeUser() {
    return {
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
    }
}