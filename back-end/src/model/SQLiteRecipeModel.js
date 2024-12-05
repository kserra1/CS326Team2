import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});


const recipe = sequelize.define("Recipe", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    cookTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prepTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    breakfast: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    lunch: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    dinner: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    snack: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    categories: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ingredients: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cookware: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instructions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
})

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

// const User = sequelize.define('userObj', {
//     username:{
//         type: Sequelize.STRING,
//         // primaryKey: true, doesn't need to be primary key, we can use email for that
//         allowNull: false,
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false, 
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true,
//     }

// });
