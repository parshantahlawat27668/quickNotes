import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { tokenGenerator } from "../utils/tokenGenerator.js";
import { emailValidator, phoneValidator } from "../utils/validator.js";
import { verifyGoogleToken } from "../utils/VerifyGoogleToken.js";


const login = asyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;
    if (!(password && (email || phone))) {
        throw new apiError(400, "Please fill in all required details");
    }
    if (phone) phoneValidator(phone);
    if (email) emailValidator(email);

    const user = await User.findOne(phone ? { "phone.number": phone } : { "email.id": email }).select("+password");
    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (phone) {
        if (!user.phone.isVerified) {
            throw new apiError(401, "Phone no. is not verified");
        }
    }
    else {
        if (!user.password) {
            throw new apiError(403, "This email is registered via Google. Please login with Google.");
        }
        if (!user.email.isVerified) {
            throw new apiError(401, "Email id is not verified");
        }
    }


    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = tokenGenerator(user);

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(200, {}, "User login successfully"))
});

const loginWithGoogle = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        throw new apiError(400, "Google token is missing");
    }
    const payload = await verifyGoogleToken(idToken);
    if (!payload.email_verified) {
        throw new apiError(400, "Email not verified");
    }

    const user = await User.findOne({ googleId: payload.sub })
    if (!user) {
        throw new apiError(404, "User not found");
    }

    const { accessToken, refreshToken } = await tokenGenerator(user);
    const updatedUser = await User.findById(user._id);
    const responseUser = sanitizeUser(user);
    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(200, {user:responseUser}, "User login successfully"))
});

const logout = asyncHandler(async (req, res) => {
    const user = req.user;
    const loggedOutUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: "" }
        },
        {
            new: true
        }
    );
    return res
        .status(200)
        .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" })
        .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" })
        .json(new apiResponse(200, {}, "User logout successfully"))
});

const register = asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!(name && password && (email || phone))) {
        throw new apiError(400, "All fields are required.");
    }
    if (phone) phoneValidator(phone);
    if (email) emailValidator(email);

    const existingUser = await User.findOne(phone ? { "phone.number": phone } : { "email.id": email });
    const userData = {};
    if (phone) {
        if (existingUser && existingUser.phone.isVerified) {
            throw new apiError(409, "Phone number is already registered");
        }
        if (existingUser && !existingUser.phone.isVerified) {
            await User.findByIdAndDelete(existingUser._id);
        }

        const { otp, expiresAt } = generateOTP();
        const phoneData = {};
        phoneData.number = phone;
        phoneData.otp = {
            code: otp,
            expiresAt: expiresAt
        }
        userData.phone = phoneData;
    }
    else {
        if (existingUser && existingUser.email.isVerified) {
            throw new apiError(409, "Email id is already registered");
        }
        if (existingUser && !existingUser.email.isVerified) {
            await User.findByIdAndDelete(existingUser._id);
        }

        const { otp, expiresAt } = generateOTP();
        const emailData = {};
        emailData.id = email;
        emailData.otp = {
            code: otp,
            expiresAt: expiresAt
        }
        userData.email = emailData;
    }

    userData.name = name;
    userData.password = password;


    const user = await User.create(userData);

    if (!user) {
        throw new apiError(400, "Something went wrong while registering user");
    }

    // send otp 
    if (phone) {
        console.log("Your phone verification code is : ", user.phone.otp.code);
    }
    else {
        console.log("Your email verification code is : ", user.email.otp.code);
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(201, {}, `Verification code sent successfully`))

});

const registerWithGoogle = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        throw new apiError(400, "Id Token is missing");
    }
    const payload = await verifyGoogleToken(idToken);
    if (!payload.email_verified) {
        throw new apiError(400, "Email not verified");
    }

    const existingUser = await User.findOne({ $or:[ {googleId: payload.sub}, {"email.id":payload.email}]});
    const userData = {};

    if (existingUser && existingUser.email.isVerified) {
        throw new apiError(409, "Email id is already registered");
    }
    if (existingUser && !existingUser.email.isVerified) {
        await User.findByIdAndDelete(existingUser._id);
    }

    const emailData = {};
    emailData.id = payload.email;
    emailData.isVerified = true;
    userData.email = emailData;
    userData.name = payload.name;
    userData.googleId = payload.sub;
    const user = await User.create(userData);

    const {accessToken, refreshToken} = await  tokenGenerator(user);

    const responseUser = sanitizeUser(user);
    return res
        .status(201)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(201, {user:responseUser}, 'User register successfully'))
});

const verifyPhone = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
    if (!(phone && otp)) {
        throw new apiError(400, "Phone and OTP are required.");
    }
    phoneValidator(phone);

    const user = await User.findOne({ "phone.number": phone });
    if (!user) {
        throw new apiError(400, "User not found");
    }
    if (user.phone.isVerified) {
        throw new apiError(409, "Phone no. is already verified");
    }
    if (user.phone.otp.expiresAt <= new Date()) {
        throw new apiError(410, "OTP expired");
    }
    if (otp !== user.phone.otp.code) {
        throw new apiError(400, "Invalid OTP");
    }

    user.phone.otp = undefined;
    user.phone.isVerified = true;
    await user.save();

    const { accessToken, refreshToken } = tokenGenerator(user);
    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(200, {}, "Phone no. verified successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!(email && otp)) {
        throw new apiError(400, "Email id and OTP are required.");
    }
    emailValidator(email);

    const user = await User.findOne({ "email.id": email });
    if (!user) {
        throw new apiError(400, "User not found");
    }
    if (user.email.isVerified) {
        throw new apiError(409, "Email id is already verified");
    }
    if (user.email.otp.expiresAt <= new Date()) {
        throw new apiError(410, "OTP expired");
    }
    if (otp !== user.email.otp.code) {
        throw new apiError(400, "Invalid OTP");
    }

    user.email.otp = undefined;
    user.email.isVerified = true;
    await user.save();

    const { accessToken, refreshToken } = tokenGenerator(user);
    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(200, {}, "Email id verified successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        throw new apiError(401, "Unauthorized request");
    }
    let decodeToken;
    try {
        decodeToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });
    } catch (error) {
        throw new apiError(401, "Unauthorized request");
    }
    if (!decodeToken) {
        throw new apiError(400, "Invalid refresh token");
    }

    const user = await User.findById(decodeToken._id).select("+refreshToken");
    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
        throw new apiError(400, "Refresh token is expired");
    }

    const { accessToken, refreshToken } = await tokenGenerator(user);

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(new apiResponse(200, {}, "Tokens refreshed successfully"));
});

const getCurrentUser = asyncHandler(async(req, res)=>{
    const user = req.user;
    const responseUser = sanitizeUser(user);
    return res
    .status(200)
    .json(new apiResponse(200,{user:responseUser},"User fetched successfully"))
});
export {
    login,
    register,
    verifyPhone,
    refreshAccessToken,
    loginWithGoogle,
    registerWithGoogle,
    logout,
    verifyEmail,
    getCurrentUser
};