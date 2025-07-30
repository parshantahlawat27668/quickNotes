import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        id: {
            type: String,
            default: undefined,
            lowercase: true,
            trim: true,
            unique: true,
            sparse: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Invalid email id "
            }
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: { type: String },
            expiresAt: { type: Date },
            attempts: { type: Number, default: 0 }
        }
    },
    phone: {
        number: {
            type: String,
            unique: true,
            sparse:true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[6-9]\d{9}$/.test(v);
                },
                message: "Invalid phone number"
            },
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: { type: String },
            expiresAt: { type: Date },
            attempts: { type: Number }
        }
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
        default:undefined
    },
    forgotPassword: {
        email: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, default: 0, select: false }
        },
        phone: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, default: 0, select: false }
        }
    },
    refreshToken: {
        type: String,
        default: "",
        select: false
    },
    googleId: {
  type: String,
  unique: true,
  sparse: true
},

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
            algorithm: "HS256"
        }
    );
}

userSchema.methods.generateRefreshToken = async function(){
    return  jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
            algorithm: "HS256"
        }
    );
}

const User = mongoose.model("User", userSchema);
export default User;