import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    referralCode: { type: String, required: true, unique: true },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("User", UserSchema);