import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name:String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age:Number,
    password: {
        type: String,
        required: true
    },
    role: {
        type:String,
        enum: ["user", "admin", "premium"],
        default: "user"
    }, 
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }

});


export const userModel = mongoose.model("users", userSchema);