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
        if((/^[a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+|-]\d{4} \([a-zA-Z]+\)$/).test(value))
            return Sequelize.DATE
        else    
            return Sequelize.STRING
    } else if (type === 'number'){
        return Sequelize.NUMBER
    } else if (type === 'boolean') {
        return Sequelize.BOOLEAN
    } else if (type === 'object') {
        return Sequelize.STRING
    }
    throw new ReferenceError("Unrecognized Type: ", type)
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
        primaryKey: true,
    }

});
