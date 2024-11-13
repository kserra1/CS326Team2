export class Recipe {
    #float = NaN
    #string = ''
    #ingredient = {
        item: this.#string,
        amount: this.#float,
        unit: this.#string,
    }
    #comment = {
        user: this.#string,
        text: this.#string,
        like: false,
        difficulty: this.#float,
    }
    #recipe = {
        id: this.#float,
        title: this.#string,
        author: this.#string,
        date: new Date().toString(),
        lastUpdated: new Date().toString(),
        cookTime: this.#float,
        prepTime: this.#float,
        difficulty: 0,
        description: this.#string,
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
        categories: [this.#string],
        image: this.#string,
        ingredients: [this.#ingredient],
        cookware: [this.#string],
        instructions: [this.#string],
        comments: [this.#comment],
        likes: 0,
    }
    isUnd = (val)=> {
        return Object.entries(this).filter(([k,_])=>k.startsWith('#'))
        .some(([_,v])=>v==val)
    }
    #getDefault = (key)=>{
        if(Array.isArray(this.#recipe[key]))
            return this.#recipe[key].map(e=>this.#getDefault(e))
        if(typeof value === 'object')
            return Object.fromEntries(Object.entries(this.#recipe[key]).map(([k,v])[k, this.#getDefault(v)]))
        return this.#recipe[key]
    }
    #setDefault = (oldValue, newValue) => {
        switch(typeof oldValue){
            case 'boolean':
            case 'undefined':
                if(typeof newValue !== 'boolean')
                    throw new TypeError("Invalid boolean", newValue)
                return Boolean(newValue)
            case 'string':
                if(typeof newValue !== "string")
                    throw new TypeError("Invalid string:", newValue)
                return String(newValue)
            case 'number':
                if((/^\d*\.\d+$/).test(newValue))
                    throw new TypeError("Invalid number:", newValue)
                return Number.parseFloat(newValue)
            case 'object':
                if(Array.isArray(oldValue)){
                    if(Array.isArray(newValue)){
                        const retVal = []
                        for(const v of newValue){
                            return this.#setDefault(oldValue, v)
                        }
                        return retVal
                    } else {
                        if(this.isUnd(oldValue[0]))  oldValue.splice(0, 1)
                        const found = oldValue.find(v=>v==newValue)
                        if(found) 
                            return oldValue.toSpliced(found, 1)
                        else 
                            return oldValue.toSpliced(-1, 0, newValue)
                    }
                } else {
                    if(typeof newValue !== "object")
                        throw new TypeError("Invalid object:", newValue)
                    const retVal = []
                    for(const field in oldValue) {
                        if(field in newValue)
                            retVal.push([field, this.#setDefault(oldValue[field], newValue[field])])
                        else 
                            throw new TypeError("Invalid object properties:", newValue)
                    }
                    return Object.fromEntries(retVal)
                }
        }
        return oldValue
    }
    constructor(data) {
        //Getter and Setters for each property of recipe
        for (const [key, value] of Object.entries(this.#recipe)) {
            Object.defineProperty(this, key, {
                get() {
                    return this.#recipe[key]
                },
                set(newValue) {
                    //this.#recipe.lastUpdated = new Date().toString()
                    this.#recipe[key] = this.#setDefault(value, newValue)
                },
                enumerable: true,
                configurable: true
            })
        }
        if(data !== undefined)
            this.#recipe = data
    }

    *[Symbol.iterator]() {
        for (const property in this.#recipe) {
            yield [property, this[property], (newValue)=>this[property] = newValue]
        }
    }
    
    updateDifficulty(){
        this.difficulty = 
        this.comments.reduce((acc, c)=>c ? acc+c.difficulty/2 : acc, 0)
    }
    get data(){
        //this.updateDifficulty()
        return this.#recipe
        throw new ReferenceError("Not all values are initialized")
    }
}
export const mockRecipesObjs = ()=> {
    const mock1 = new Recipe()

    mock1.title = 'Pancakes'
    mock1.author = 'Brian'
    mock1.ingredients = ['flour', 'eggs', 'milk', 'butter'],
    mock1.instructions =  ['Mix ingredients together', 'cook on griddle'],
    mock1.cookTime = 15
    mock1.categories = ['breakfast']
    mock1.breakfast = true
    mock1.lunch = false
    mock1.dinner = false
    mock1.snack = false
    mock1.comments = [
        {user: 'John', text: 'These are great pancakes!', like:true, difficulty:1},
        {user: 'Jane', text: 'I love these pancakes!', like:true, difficulty:1}
    ]
    mock1.likes = 80085
    

    const mock2 = new Recipe()

    mock2.title = 'Grilled Cheese'
    mock2.author = 'Jane'
    mock2.ingredients = ['bread', 'cheese', 'butter'],
    mock2.instructions =  ['Butter bread', 'put cheese between slices', 'cook on griddle'],
    mock2.cookTime = 10
    mock2.categories = ['lunch']
    mock2.breakfast = false
    mock2.lunch = true
    mock2.dinner = false
    mock2.snack = false
    mock2.comments = [
        {user: 'John', text: 'This is a great grilled cheese recipe!', like:true, difficulty:1},
    ]
    mock2.likes = 80085


    const mock3 = new Recipe()

    mock3.title = 'Spaghetti'
    mock3.author = 'John'
    mock3.ingredients = ['pasta', 'sauce', 'meatballs'],
    mock3.instructions =  ['Boil pasta', 'heat sauce and meatballs', 'serve together'],
    mock3.cookTime = 30
    mock3.categories = ['dinner']
    mock3.breakfast = false
    mock3.lunch = false
    mock3.dinner = true
    mock3.snack = false
    mock3.comments = [
        {user: 'Jane', text: 'I love spaghetti!', like:true, difficulty:2}
    ]
    mock3.likes = 80085

    return [mock1.data, mock2.data, mock3.data]
    
}