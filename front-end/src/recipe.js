export class Recipe {
    constructor(data) {
        
        this.IDable = {
            id:undefined, 
            name:undefined
        }
        this.ingredient = {
            item: undefined,
            amount: undefined,
        }
        this.comment = {
            user: undefined,
            text: undefined,
            like: undefined,
            difficulty: undefined
        }
        this.updateNumber = (includes = /^\d*\.\d+$/, num = undefined)=>{
            if((includes).test(num))
                this.recipeData = num
            else
                throw new TypeError("Not a valid number")
        }
        this.updateString = ()=>{
            if(string)
        }
        if(data !==undefined ){
            this.recipeData = data
            return 
        }
        this.recipeData = {
            title: undefined,
            author: undefined,
            date: new Date().toString(),
            lastUpdated: new Date().toString(),
            cookTime: undefined,
            prepTime: undefined,
            difficulty: undefined,
            description: undefined,
            breakfast:false,
            lunch:false,
            dinner:false,
            snack:false,
            categories: undefined,
            image: undefined,
            ingredients: undefined,
            cookware: undefined,
            instructions: undefined,
            comments: [],
            likes:0,
        }
    }
    
    setTitleID(ID){
        this.recipe.creation.title.id=ID
    }
    setAuthorID(ID){
        this.recipe.creation.author.id=ID
    }
    setDifficulty(){
        this.recipeData.description.difficulty = 
        this.recipeData.community.comments.reduce((acc, c)=>acc+c.difficulty/2, 0)
    }

    // iterates through uninitialized values
    *[Symbol.iterator]() {
        for (const property in this.recipeData) {
            yield [property, this.recipeData[property], 
                    (str)=>this.recipeData[property]=str]
        }
    }
    getData(){
        this.setDifficulty()
        if(Array.from([Symbol.iterator]()).every(e=>e!==undefined))
            return this.recipeData
        else
            throw new ReferenceError("Not all values are initialized")
    }
}
export const mockRecipesObjs = ()=> {
    
    const creation = (recipeObj)=>recipeObj.recipeData.creation
    const about = (recipeObj)=>recipeObj.recipeData.about
    const directions = (recipeObj)=>recipeObj.recipeData.directions
    const community = (recipeObj)=>recipeObj.recipeData.community


    const mock1 = new Recipe()

    creation(mock1).title = 'Pancakes'
    creation(mock1).author = 'Brian'
    directions(mock1).ingredients = ['flour', 'eggs', 'milk', 'butter'],
    directions(mock1).instructions =  ['Mix ingredients together', 'cook on griddle'],
    about(mock1).cookTime = 15
    about(mock1).categories = ['breakfast']
    about(mock1).tags.breakfast = true
    about(mock1).tags.lunch = false
    about(mock1).tags.dinner = false
    about(mock1).tags.snack = false
    community(mock1).comments = [
        {user: 'John', text: 'These are great pancakes!', like:true, difficulty:1},
        {user: 'Jane', text: 'I love these pancakes!', like:true, difficulty:1}
    ]
    community(mock1).likes = 0
    

    const mock2 = new Recipe()

    creation(mock2).title = 'Grilled Cheese'
    creation(mock1).author = 'Jane'
    directions(mock2).ingredients = ['bread', 'cheese', 'butter'],
    directions(mock2).instructions =  ['Butter bread', 'put cheese between slices', 'cook on griddle'],
    about(mock2).cookTime = 10
    about(mock2).categories = ['lunch']
    about(mock2).tags.breakfast = false
    about(mock2).tags.lunch = true
    about(mock2).tags.dinner = false
    about(mock2).tags.snack = false
    community(mock2).comments = [
        {user: 'John', text: 'This is a great grilled cheese recipe!', like:true, difficulty:1},
    ]
    community(mock2).likes = 1


    const mock3 = new Recipe()

    creation(mock3).title = 'Spaghetti'
    creation(mock1).author = 'John'
    directions(mock3).ingredients = ['pasta', 'sauce', 'meatballs'],
    directions(mock3).instructions =  ['Boil pasta', 'heat sauce and meatballs', 'serve together'],
    about(mock3).cookTime = 30
    about(mock3).categories = ['dinner']
    about(mock3).tags.breakfast = false
    about(mock3).tags.lunch = false
    about(mock3).tags.dinner = true
    about(mock3).tags.snack = false
    community(mock3).comments = [
        {user: 'Jane', text: 'I love spaghetti!', like:true, difficulty:2}
    ]
    community(mock3).likes = 35

    return [mock1, mock2, mock3]
    
}