import RecipeService from './services/recipeservice.js';
export class Recipe {
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
                date: new Date(),
                lastUpdated: new Date(),
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

        function makeList(obj) {
            return Object.entries(obj).flatMap(([k,v])=>{
                if(typeof v === "object" && !Array.isArray(v))
                    return makeList(v).map(e=>{
                        e.key = k+' '+e.key
                        return e
                    })
                
                const change = Array.isArray(v) ? (e)=>obj[k].push(e) : (e)=>obj[k]=e
                const update = (e)=>{lastUpdated = new Date; change(e);}
                return {key:k, val:v, update:update}
            })
        }
        this.list = makeList(this.recipeData)
        console.log(this.list)
        // console.log(this.recipeData.about.preptime)
        // this.list[5].change(0)
        // console.log(this.recipeData.about.preptime)

        this.recipeData.creation.title.name = title
        this.recipeData.creation.author.name = author
        this.recipeData.creation.author.id = authorID
    }
    
    setID(ID){
        this.recipe.creation.title.id=ID
    }


    
    //iterator that iterates through uninitialized values
    [Symbol.iterator]() {
        const uninitialized = (v)=>v===-1||v===''||v.length===1&&uninitialized(v[0])
        const list = this.list
        let i = 0
        console.log(list.every(e=>!uninitialized(e.val)) )
        return {
            next() {
                while(!uninitialized(list[i].val)) i=(i+1)%list.length
                return { 
                    value: list[++i], 
                    done: list.every(e=>!uninitialized(e.val)) 
                }
            }
        }
    }
}
