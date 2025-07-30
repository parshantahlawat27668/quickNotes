import Note from "../models/note.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNote = asyncHandler(async(req, res)=>{
    const user = req.user;
    const {title, note} = req.body;
    if(!(title && note)){
        throw new apiError(400,"Title or note are missing");
    }
    await Note.create({
        user:user._id,
        title:title,
        note:note
    });
    const notes = await Note.find({user:user._id});
    return res
    .status(201)
    .json(new apiResponse(201,{notes},"Note saved successfully"))

});

const deleteNote = asyncHandler(async(req, res)=>{
    const user = req.user;
    const {noteId} = req.params;
    
    if(!noteId){
        throw new apiError(400,"Note id is missing");
    }

    await Note.findOneAndDelete({user:user._id, _id:noteId});
    const notes = await Note.find({user:user._id});
    return res
    .status(200)
    .json(new apiResponse(200,{notes},"Note deleted successfully"));
});

const myNotes = asyncHandler(async (req, res)=>{
    const user = req.user;
    const notes = await  Note.find({user:user._id});
    return res
    .status(200)
    .json(new apiResponse(200,{notes},"Notes fetched successfully"));
});

export {
createNote,
deleteNote,
myNotes
};