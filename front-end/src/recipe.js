export class Recipe {
    constructor(author) {
        this.IDable = {id:-1, name:''}
        this.ingredient = {
            item: this.IDable,
            amount: -1,
        }
        this.comment = {
            user: this.IDable,
            text:'',
            like:false,
            difficulty:-1
        }
        this.recipeData = {
            creation: {
                title: {id:0, name:''},
                author: {id:0, name:author},
                date: new Date().toString(),
                lastUpdated: new Date().toString(),
            },
            about: {
                cookTime: -1,
                prepTime: -1,
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
            if (typeof value === 'object') {
                yield* this.#iterate(value, fullKey)
            } else if(Array.isArray(value)) {
                //different functionality when it reaches arrays
            } else {
                yield [fullKey, value];
            }
        }
    }
    
}
export const mockRecipesObjs = ()=> {
    const mock1 = new Recipe('Brian')
    
    const creation = mock1.recipeData.creation
    const about = mock1.recipeData.about
    const directions = mock1.recipeData.directions
    const community = mock1.recipeData.community

    creation.title = 'Pancakes'
    directions.ingredients = ['flour', 'eggs', 'milk', 'butter'],
    directions.instructions =  ['Mix ingredients together and cook on griddle'],
    about.cookTime = 15
    about.categories = ['breakfast']
    about.tags.breakfast = true
    about.tags.lunch = false
    about.tags.dinner = false
    about.tags.snack = false
    community.comments = [
        {user: 'John', text: 'These are great pancakes!', like:true, difficulty:1},
        {user: 'Jane', text: 'I love these pancakes!', like:true, difficulty:1}
    ]
    community.likes = 0
    
    return [mock1]
    
}