import { Sequelize, DataTypes } from 'sequelize';
//Create a new instance of Sequelize (ORM)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

//Define the user model with the following fields
const User = sequelize.define('User',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
//Define the user SQLite model with the following fields for CRUD operations
class _SQLiteUserModel {
    constructor() {}
    //Initialize the SQLite database
    async init(fresh = false){
        await sequelize.authenticate();
        await sequelize.sync({force: true});

        if(fresh){
            await this.delete();

            await this.create({
                username: 'testUser',
                password: 'testPassword',
                email: 'test@gmail.com',
            });
            await this.create({
                username: 'testUser2',
                password: 'testPassword2',
                email: 'test2@gmail.com',
        });
    }
    return this;
}
    //Create a new user
    async create(data){
        return await User.create(data);
    }
    //Read the user
    async read(username = null){
        if(username){
            return await User.findOne({where: {username}});
        }
        return await User.findAll();
    }
    //Update the user
    async update(userData){
        const user = await User.findByPk(userData.id);
        if(user){
            await user.update(userData);
        }
        return user;
    }
    //Delete the user
    async delete(user = null) {
        if (user === null) {
          await User.destroy({ truncate: true });
          return;
        }
        await User.destroy({ where: { id: user.id } });
        return user;
      }
    
}
//Export the SQLiteUserModel class
const SQLiteUserModel = new _SQLiteUserModel();
export default SQLiteUserModel;