import mongoose, { Mongoose } from "mongoose"

const noteSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
title:{
    type:String,
    required:[true,"Title is required"],
    trim:true
},
note:{
    type:String,
    default:"",
    trim:true
}
},{timestamps:true});

const Note = mongoose.model("Note",noteSchema);
export default Note;