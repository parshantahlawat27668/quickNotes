import {apiError} from "./apiError.js"
const tokenGenerator = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "Somthing went wrong while generating tokens");
    }
}
export  {tokenGenerator};