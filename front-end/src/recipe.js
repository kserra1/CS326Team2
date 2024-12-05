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
    #recipe_template = {
        //id: 0,
        title: this.#string,
        author: this.#string,
        date: new Date().toString(),
        lastUpdated: new Date().toString(),
        cookTime: { hours: this.#float, minutes: this.#float },
        prepTime: { hours: this.#float, minutes: this.#float },
        difficulty: 0,
        description: this.#string,
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
        categories: [this.#string],
        image: new File([], ''),
        ingredients: [this.#ingredient],
        cookware: [this.#string],
        instructions: [this.#string],
        comments: [this.#comment],
        likes: 0,
    }
    #recipe = structuredClone(this.#recipe_template)
    isUnd = (key)=> {
        if(typeof this.#recipe[key] === 'boolean')
            return false
        return JSON.stringify(this.#recipe[key]) === JSON.stringify(this.#recipe_template[key])
    }
    check (oldValue, newValue) {
        if(oldValue.constructor !== newValue.constructor)
            throw new TypeError('Tried to set the wrong type')
        if(Array.isArray(oldValue)){
            for(const val of newValue)
                this.check(oldValue[0], val)    
        }
        if(oldValue.constructor === Object){
            if(Object.keys(oldValue).some((v, i) => v !== Object.keys(newValue)[i]))
                throw new TypeError('Invalid object properties:', Object.keys(newValue))
            Object.values(oldValue).forEach((v, i) => this.check(v, Object.values(newValue)[i]))
        }
    }
    constructor(data) {
        if(data !== undefined)
            this.#recipe = data

        //Getter and Setters for each property of recipe
        for (const [key, value] of Object.entries(this.#recipe)) {
            Object.defineProperty(this, key, {
                get() {
                    return this.#recipe[key]
                },
                set(newValue) {
                    if(newValue !== null) {
                        this.#recipe.lastUpdated = new Date().toString()
                        this.check(value, newValue)
                        this.#recipe[key] = newValue
                    } else
                        this.#recipe[key] = this.#recipe_template[key]
                },
                enumerable: true,
                configurable: true
            })
        }
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
    saveFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
            reader.readAsText(file)
        })
    }
    async getData(){
        this.updateDifficulty()
        const saveRecipe = structuredClone(this.#recipe)
        if (this.image) {
            try {
                saveRecipe.image = await this.saveFile(this.image)
            } catch (error) {
                console.error("Error converting file to text:", error);
            }
        }
        console.log(saveRecipe)
        return saveRecipe 
    }


}
export const mockRecipesObjs = ()=> {
    const mock1 = new Recipe()

    mock1.title = 'Pancakes'
    mock1.author = 'Brian'
    mock1.ingredients = [{item: 'flour', amount: 1, unit:'cup'}, {item: 'eggs', amount: 1, unit:'cup'}, {item: 'milk', amount: 1, unit:'cup'}, {item: 'butter', amount: 1, unit:'cup'}],
    mock1.instructions =  ['Mix ingredients together', 'cook on griddle'],
    mock1.cookTime = {hours:0, minutes:15}
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
    mock2.ingredients = [{item: 'bread', amount: 1, unit:'cup'}, {item: 'cheese', amount: 1, unit:'cup'}, {item: 'butter', amount: 1, unit:'cup'}],
    mock2.instructions =  ['Butter bread', 'put cheese between slices', 'cook on griddle'],
    mock2.cookTime = {hours:0, minutes:20}
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
    mock3.ingredients = [{item: 'pasta', amount: 1, unit:'cup'}, {item: 'sauce', amount: 1, unit:'cup'}, {item: 'meatballs', amount: 1, unit:'cup'}],
    mock3.instructions =  ['Boil pasta', 'heat sauce and meatballs', 'serve together'],
    mock3.cookTime = {hours:0, minutes:30}
    mock3.categories = ['dinner']
    mock3.breakfast = false
    mock3.lunch = false
    mock3.dinner = true
    mock3.snack = false
    mock3.comments = [
        {user: 'Jane', text: 'I love spaghetti!', like:true, difficulty:2}
    ]
    mock3.likes = 80085

    return [mock1.getData(), mock2.getData(), mock3.getData()]
    
}