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
        
        this.sequObj.id = {
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
        } else {
            recipe = await this.sequelizeRecipe.create(this.stringify(recipeObj))
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
    }
    async read(identifier = null){
        let retVal
        if(identifier){
            retVal = [await this.sequelizeRecipe.findOne(
                {
                    where: this.stringify(identifier)
                }
            )]
        } else 
            retVal = await this.sequelizeRecipe.findAll()
        return retVal.map(e=>this.parse(e.dataValues))
    }
    async delete(deleteID = null){
        if(deleteID){
            await this.sequelizeRecipe.destroy({ where: {recipe_id: deleteID} });
        } else {
            await this.sequelizeRecipe.destroy({ truncate: true });
        }
        return recipeObj
    }
}

const _SQLiteRecipeModel = new SQLiteRecipeModel();
export default _SQLiteRecipeModel;