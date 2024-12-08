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
                console.log("key", key, "val", val)
                try {
                    return [key, JSON.parse(val)]
                } catch {
                    return [key, val]
                }
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
        
        this.sequObj["recipe-id"] = {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        }
        this.sequelizeRecipe = this.sequelize.define("Recipe", this.sequObj)
        await this.sequelize.sync({ force: false });
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
        let retVal
        if(title){
            retVal = [await this.sequelizeRecipe.findOne(
                {
                    where: { title: JSON.stringify(title) }
                }
            )]
        } else 
            retVal = await this.sequelizeRecipe.findAll()
        return retVal.map(e=>this.parse(e.dataValues))
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