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

//below will define sequlize schema for the user object

//below is general sqlize define function:

// sequelize.define('modelName', {
//     columnA: {
//         type: Sequelize.BOOLEAN,
//         validate: {
//           is: ["[a-z]",'i'],        // will only allow letters
//           max: 23,                  // only allow values <= 23
//           isIn: {
//             args: [['en', 'zh']],
//             msg: "Must be English or Chinese"
//           }
//         },
//         field: 'column_a'
//         // Other attributes here
//     }, <-- this bracket is end of column A
//     columnB: Sequelize.STRING,
//     columnC: 'MY VERY OWN COLUMN TYPE'
// })

//the user object needs to have ID, name, email, and maybe password?
// export class User {
//     constructor(username, password, email) {
//       this.username = username;
//       this.password = password;
//       this.email = email;
//     }
//   }

//above taken from the 

const User = sequelize.define('userObj', {
    username:{
        type: Sequelize.STRING,
        // primaryKey: true, doesn't need to be primary key, we can use email for that
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey:true,
    }

});
