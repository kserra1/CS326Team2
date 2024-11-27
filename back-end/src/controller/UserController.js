import ModelFactory from "../model/ModelFactory.js";
class UserController{
    constructor() {
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
      }
    

    async register(req, res) {
        const { username, password, email } = req.body;
        try{
        const existingUser = await this.model.read(username);
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        const newUser = await this.model.create({username, password, email});
        return res.status(201).json({message: "User created", user: newUser, status: 201});   
    }catch(err){
        console.error("Error creating user:", err);
        return res.status(500).json({error: "Error creating user"}, err);
    }
    }

    async login(req, res){
        const {username, password } = req.body;

        const user = await this.model.read(username);
        if(!user){
            return res.status(401).json({error: "User does not exist"});
        }
        if(user.password !== password){
            console.log("Incorrect password");
            return res.status(401).json({error: "Incorrect password"});
        }
        console.log("Login successful");
        return res.json({message: "Login successful", status: 201});
    }
}

export default new UserController();