import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, default: "User" },
    referralCode: { type: String, required: true, unique: true },
    friends: [{ type: Object }],
    referredBy: { type: String },
    referralCount: { type: Number, default: 0 },
    lastReferralDate: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);