export default class Recipe {
    constructor(title, author, authorID) {
        this.IDable = {id:-1, name:''}
        this.ingredient = {
            item: this.IDable,
            amount: -1,
        }
        this.comment = {
            author: this.IDable,
            text:'',
            like:false,
            difficulty:-1
        }
        this.recipeData = {
            creation: {
                title: {id:0, name:title},
                author: {id:authorID, name:authorID},
                date: new Date().toString(),
                lastUpdated: new Date().toString(),
            },
            about: {
                cooktime: -1,
                preptime: -1,
                difficulty: 0,
                description: '',
                tags: {
                    breakfast:false,
                    lunch:false,
                    dinner:false,
                    snack:false,
                },
                categories: [this.IDable],
                image: '',
            },
            directions: {
                ingredients: [this.ingredient],
                cookware: [this.IDable],
                instructions: [''],
            },
            community: {
                comments: [this.comment],
                likes:0,
            },
        }
        this.recipeData.creation.title.name = title
        this.recipeData.creation.author.name = author
        this.recipeData.creation.author.id = authorID
    }
    
    setID(ID){
        this.recipe.creation.title.id=ID
    }

    // iterates through uninitialized values
    *[Symbol.iterator]() {
        yield* this.#iterate(this.recipeData);
    }

    *#iterate(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix} ${key}` : key;
            if (typeof value === 'object' && value !== null) {
                yield* this.#iterate(value, fullKey); // Recursively iterate for nested objects
            } else {
                yield [fullKey, value]; // Yield key-value pair
            }
        }
    }
}
