class InMemoryUserModel{
    constructor(){
        this.users = [];
    }
    //create a new user
    async createUser(username, password, email){
        const user = {username, password, email};
        this.users.push(user);
        return user;
    }
    //get all the users
    async getUser(username){
        return this.users.find(user => user.username === username);
    }
    async comparePassword(inputPassword, storedPassword){
        return inputPassword === storedPassword;
    }
}

export default InMemoryUserModel;