const sanitizeUser = (user)=>{
const sanitizedUser =user.toObject();
delete sanitizedUser.forgotPassword;
delete sanitizedUser.email?.otp;
delete sanitizedUser.phone?.otp;
delete sanitizedUser.password;
delete sanitizedUser.refreshToken;
return sanitizedUser;

}

export {sanitizeUser};