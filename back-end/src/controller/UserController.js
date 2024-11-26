import ModelFactory from "../model/ModelFactory.js";
class UserController{
    constructor() {
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
      }
    

    async register(req, res) {
        const { username, password, email } = req.body;
        const existingUser = await this.model.read(username);
        if (existingUser.isNewRecord === false) {
            return res.status(400).json({error: "User already exists"});
        }
        const newUser = await this.model.create({username, password, email});
        res.status(201).json({message: "User created", user: newUser});  
    }

    async login(req, res){
        const {username, password } = req.body;

        const user = await this.model.read(username);
        if(!user){
            return res.status(401).json({error: "User does not exist"});
        }
        if(user.password !== password){
            return res.status(401).json({error: "Incorrect password"});
        }
        res.json({message: "Login successful"});
    }
}

export default new UserController();