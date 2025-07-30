import mongoose from "mongoose"
import { dbName } from "../constants.js";

const dbConnection = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${dbName}?retryWrites=true&w=majority`);
        console.log("Database connected successfully : Host => ",connectionInstance.connection.host);
    } catch (error) {
        console.log("error while connecting db",error);
    }
}

export default dbConnection;