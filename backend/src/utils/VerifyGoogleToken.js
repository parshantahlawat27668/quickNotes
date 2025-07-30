import { OAuth2Client } from "google-auth-library";
import { apiError } from "./apiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async(idToken) =>{
const ticket = await client.verifyIdToken({
    idToken,
    audience:process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();

if(!payload?.email || !payload?.sub){
    throw new apiError(400,"Invalid token payload");
}

return payload;
}