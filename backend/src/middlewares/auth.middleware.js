import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ","")
        if(!token){
            throw new apiError(401,"Unauthorized request");
        }
        const tokenInfo  = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,{algorithms:["HS256"]});
        const user = await User.findById(tokenInfo._id);
        if(!user){
            throw new apiError(401,"Invalid access token");
        }
        req.user = user;
        next();

    } catch (error) {
        throw new apiError(401,"Invalid access");
    }
}); 