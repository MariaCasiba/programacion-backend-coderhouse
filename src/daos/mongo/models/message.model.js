import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    user:String,
    message:String,
}, { timestamps: true});

export const messageModel = mongoose.model("messages", messageSchema);

