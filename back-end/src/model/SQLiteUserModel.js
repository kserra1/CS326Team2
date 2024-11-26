import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});


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

class _SQLiteUserModel {
    constructor() {}

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

    async create(data){
        return await User.create(data);
    }

    async read(username = null){
        if(username){
            return await User.findOne({where: {username}});
        }
        return await User.findAll();
    }

    async update(userData){
        const user = await User.findByPk(userData.id);
        if(user){
            await user.update(userData);
        }
        return user;
    }
    async delete(user = null) {
        if (user === null) {
          await User.destroy({ truncate: true });
          return;
        }
        await User.destroy({ where: { id: user.id } });
        return user;
      }
    
}

const SQLiteUserModel = new _SQLiteUserModel();
export default SQLiteUserModel;