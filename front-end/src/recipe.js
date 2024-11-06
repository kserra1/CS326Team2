export class Recipe {
    constructor(title, name) {
        
        IDable = {id:0, name:''}
        fields={
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
                    text:'',
                    like:false,
                    difficulty:0
                },
                comments: [],
                likes:0,
            },
        }
    }
    
}