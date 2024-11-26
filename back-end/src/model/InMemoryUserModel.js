class InMemoryUserModel{
    constructor(){
        this.users = [];
    }

    async createUser(username, password, email){
        const user = {username, password, email};
        this.users.push(user);
        return user;
    }

    async getUser(username){
        return this.users.find(user => user.username === username);
    }

    async comparePassword(inputPassword, storedPassword){
        return inputPassword === storedPassword;
    }
}

export default InMemoryUserModel;