import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

const sequObj = Object.fromEntries(
    [title, author, date, lastUpdated, cookTime, prepTime, difficulty, description, breakfast, lunch, 
        dinner, snack, categories, image, ingredients, cookware, instructions, comments, likes]
    .map(field=>[field, { type: DataTypes.STRING }]))

sequObj["id"] = {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
}
const recipe = sequelize.define("Recipe", sequObj)

class SQLiteRecipeModel {
    stringify(recipeObj){
        return Object.fromEntries(Object.entries(recipeObj).map(field=>{
            return typeof field === "object" ?
                JSON.stringify(field) : field
        }))
    }
    parse(recipeObj){
        return Object.fromEntries(Object.entries(recipeObj).map(field=>{
            return typeof field === "object" ?
                JSON.parse(field) : field
        }))
    }
    async init(){
        await sequelize.sync({ force: true });
    }
    async create(recipeObj){
        if(Array.isArray(recipeObj)){
            await recipe.bulkCreate(recipeObj.map(this.stringify))
        }
        await recipe.findOrCreate({
            where: { title: JSON.stringify(recipeObj.title) },
            default: this.stringify(recipeObj)
        })
    }
    async read(title = null){
        if(title){
            return await recipe.findOne({where: { title: JSON.stringify(title) }});
        }
        return (await recipe.findAll()).map(this.stringify);
    }
    async delete(recipeObj = null){
        if(recipeObj){
            await recipe.destroy({ where: this.stringify(recipeObj) });
        } else {
            await recipe.destroy({ truncate: true });
        }
        return recipeObj
    }
}

const _SQLiteRecipeModel = new SQLiteRecipeModel();
export default _SQLiteRecipeModel;