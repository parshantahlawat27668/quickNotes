import { apiError } from "./apiError.js";

const emailValidator=(id)=>{
const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
if(!valid){
throw new apiError(400,"Invalid email id");
}
}

const phoneValidator=(number)=>{
const valid = /^[6-9]\d{9}$/.test(number);
if(!valid){
throw new apiError(400,"Invalid phone number");
}
}

export {emailValidator, phoneValidator};