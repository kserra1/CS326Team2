import express from "express";
import RecipeRoutes from "./routes/RecipeRoutes.js";
//Enabled cors for two ports
import cors from "cors";

class Server {
    constructor() {
        //Initialize express
        this.app = express();
        //Configure middleware
        this.configureMiddleware();
        //Setup routes
        this.setupRoutes();
    }
    //Use cors for multiple ports
    configureMiddleware(){
        this.app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        //Serve static files
        this.app.use(express.static("../front-end/src"));
        this.app.use(express.json({ limit: "10mb" }));
    }
    //Initialize routes
    setupRoutes(){
        this.app.use("/v1", RecipeRoutes);
    }
    //Start route on separate port from front-end
    start(port = 3260){
        this.app.listen(port, ()=>{
            console.log(`Server started on port ${port}`);
        });
    }
}
//Start it up
console.log("Starting server...");
const server = new Server();
server.start();

