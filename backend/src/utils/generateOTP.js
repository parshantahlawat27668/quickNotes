import otpGenerator from "otp-generator"
const generateOTP=()=>{
     const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return {otp, expiresAt}
}

export { generateOTP};