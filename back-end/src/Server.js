import express from "express";
import RecipeRoutes from "./routes/RecipeRoutes.js";
import cors from "cors";

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.setupRoutes();
    }

    configureMiddleware(){
        this.app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        this.app.use(express.static("../front-end/src"));
        this.app.use(express.json({ limit: "10mb" }));
    }

    setupRoutes(){
        this.app.use("/v1", RecipeRoutes);
    }

    start(port = 3260){
        this.app.listen(port, ()=>{
            console.log(`Server started on port ${port}`);
        });
    }
}

console.log("Starting server...");
const server = new Server();
server.start();

