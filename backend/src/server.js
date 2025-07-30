    import {config} from "dotenv"
    import path from "path"
    config({path:path.resolve(process.cwd(), ".env")});
    import dbConnection from "./db/index.js";
    import app from "./app.js";

    const PORT = process.env.PORT;

    dbConnection()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log("server running on PORT: ",PORT);
        });
    })
    .catch((error)=>{
        console.log("Error while connecting Db", error);
    })