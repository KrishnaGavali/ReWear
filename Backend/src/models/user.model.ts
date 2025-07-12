import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  points: number;
  uploadedItems: mongoose.Types.ObjectId[];
  ongoingSwaps: mongoose.Types.ObjectId[];
  completedSwaps: mongoose.Types.ObjectId[];
  role: "user" | "admin";
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    uploadedItems: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
    ongoingSwaps: [{ type: mongoose.Types.ObjectId, ref: "Swap" }],
    completedSwaps: [{ type: mongoose.Types.ObjectId, ref: "Swap" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
