import RecipeService from './services/recipeservice.js';
export class Recipe {
  constructor(title, name) {
    IDable = { id: 0, name: "" };
    fields = {
      creation: {
        title: IDable,
        author: IDable,
        date: new Date(),
        updated: new Date(),
      },
      about: {
        cooktime: 0,
        preptime: 0,
        difficulty: 0,
        description: "",
        tags: {
          breakfast: false,
          lunch: false,
          dinner: false,
          snack: false,
        },
        categories: [],
        image: "",
      },
      directions: {
        ingredient: {
          item: IDable,
          amount: 0,
        },
        ingredients: [],
        cookware: [],
        instructions: [],
      },
      community: {
        comment: {
          author: IDable,
          text: "",
          like: false,
          difficulty: 0,
        },
        comments: [],
        likes: 0,
      },
    };
  }
}
    constructor(title, author, authorID) {
        this.IDable = {id:0, name:''}
        this.ingredient = {
            item: IDable,
            amount: 0,
        }
        this.comment = {
            author: IDable,
            text:'',
            like:false,
            difficulty:0
        }
        this.recipeData = {
            creation: {
                title: {id:-1, name:title},
                author: {id:authorID, name:authorID},
                date: new Date(),
                updated: new Date(),
            },
            about: {
                cooktime: -1,
                preptime: -1,
                difficulty: -1,
                description: '',
                tags: {
                    breakfast:false,
                    lunch:false,
                    dinner:false,
                    snack:false,
                },
                categories: [],
                image: '',
            },
            directions: {
                ingredients: [],
                cookware: [],
                instructions: [],
            },
            community: {
                comments: [],
                likes:0,
            },
        }
        this.recipe.creation.title.name = title
        this.recipe.creation.author.name = author
        this.recipe.creation.author.id = authorID
        //should add newly initialized recipe to the database
        //db should generate a new ID for the recipe to set its title ID to
        RecipeService().addRecipe(recipeData)
        //this.recipe.creation.title.id = RecipeService().addRecipe(recipeData)
    }
    
    //iterator that iterates through uninitialized values
    [Symbol.iterator]() {
        const uninitialized = (v)=>v===-1||v===''||v.length===0
        const list = Object.entries(this.recipe).map(([K,V])=>
            Object.entries(v).map(([k,v])=> [K + ' ' + K, v])
        )
        let i = -1
        return {
            next() {
                while(!uninitialized(list[++i%list.length]))
                return { value: list[i][0], 
                         done: list.every(v=>!uninitialized(v)) }
            }
        }
    }
}
