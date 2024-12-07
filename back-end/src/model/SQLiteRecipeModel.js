import { Sequelize, DataTypes } from "sequelize";

class SQLiteRecipeModel {
    stringify(recipeObj){
        return Object.fromEntries(
            Object.entries(recipeObj).map(([key, val])=>{
                return [key, JSON.stringify(val)]
            })
        )
    }
    parse(recipeObj){
        return Object.fromEntries(
            Object.entries(recipeObj).map(([key, val])=>{
                return [key, JSON.parse(val)]
            })
        )
    }
    async init(){
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "database.sqlite",
        });
        
        this.sequObj = Object.fromEntries(
            ['title', 'author', 'cookTime', 'prepTime', 
            'difficulty', 'description', 'breakfast', 'lunch', 'dinner', 
            'snack', 'categories', 'image', 'ingredients', 'cookware', 
            'instructions', 'comments', 'likes']
            .map(field=>[field, { type: DataTypes.STRING }]))
        
        this.sequObj["id"] = {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        }
        this.sequelizeRecipe = this.sequelize.define("Recipe", this.sequObj)
        await this.sequelize.sync({ force: true });
    }
    async create(recipeObj){
        let recipe
        if(Array.isArray(recipeObj)){
            recipe = await this.sequelizeRecipe.bulkCreate(recipeObj.map(this.stringify))
            console.log("recipe created", recipe)
        } else {
            recipe = await this.sequelizeRecipe.create(this.stringify(recipeObj))
            console.log("recipe created", recipe)
        }
    }
    async update(recipeObj){
        const strRecipeObj = this.stringify(recipeObj)
        const recipe = await this.sequelizeRecipe.update(
            strRecipeObj,
            {
              where: {
                title: strRecipeObj.title,
                author: strRecipeObj.author
              },
            }
        )
        console.log("recipe updated", recipe)
    }
    async read(title = null){
        if(title){
            return await this.sequelizeRecipe.findOne({where: { title: JSON.stringify(title) }});
        }
        return (await this.sequelizeRecipe.findAll()).map(this.parse);
    }
    async delete(recipeObj = null){
        if(recipeObj){
            await this.sequelizeRecipe.destroy({ where: this.stringify(recipeObj) });
        } else {
            await this.sequelizeRecipe.destroy({ truncate: true });
        }
        return recipeObj
    }
}

const _SQLiteRecipeModel = new SQLiteRecipeModel();
export default _SQLiteRecipeModel;