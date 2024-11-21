import { Sequelize, DataTypes } from "sequelize";
import { Recipe } from "../../../front-end/src/recipe";
//import { Recipe } from "/../..recipe.js"

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

const recipeClass = new Recipe()
const typeMap = (value)=>{
    const type = value.constructor
    if(type === 'string'){
        if('date' in value === "date")//blueprint
            return DataTypes.DATE
        else    
            return DataTypes.STRING
        //.....
    }
}
const recipe = sequelize.define("Task", 
    Object.fromEntries(Object.entries(recipeClass.getData())
        .map((k, v)=>{
            const value = {
                type: typeMap(value),
                allowNull: true,
            }
            return [k, value]
        }
    ))
)