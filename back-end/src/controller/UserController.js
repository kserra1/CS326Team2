import ModelFactory from "../model/ModelFactory.js";
//Import bcrypt for password encryption
import bcrypt from "bcrypt";
class UserController{
    //Constructor to get the model
    constructor() {
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
      }
    
      //Register a new user 
    async register(req, res) {
        //Get the username, password, and email from the request body
        const { username, password, email } = req.body;
        try{
        //See if the user already exists
        const existingUser = await this.model.read(username);
        //If the user exists return an error
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Store the new user in the database
        const newUser = await this.model.create({ username, password: hashedPassword, email });
        return res.status(201).json({message: "User created", user: newUser, status: 201});   
    }catch(err){
        console.error("Error creating user:", err);
        return res.status(500).json({error: "Error creating user"}, err);
    }
    }

    async login(req, res){
        const {username, password } = req.body;
        //check if user exists
        try{
        const user = await this.model.read(username);
        //If user does not exist, return error (can't login)
        if(!user){
            return res.status(401).json({error: "User does not exist"});
        }
        //Use bcrypt to compare the password
        const validatePass = await bcrypt.compare(password, user.password);
        //If password is incorrect, return error
        if(!validatePass){
            return res.status(401).json({error: "Incorrect password"});
        }

        return res.json({message: "Login successful", status: 201, username: user.username, email: user.email});
    }
    catch(err){
        console.error("Error logging in user:", err);
        return res.status(500).json({error: "Error logging in user"}, err);
    }
    }
}
//Export the controller
export default new UserController();