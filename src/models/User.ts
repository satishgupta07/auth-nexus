import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: { type: String, trim: true },
        password: { type: String, required: [true, "Password is required"], select: false },
        isVerified: { type: Boolean, default: false },
        // Store a jti, never the raw JWT, so a used or superseded link can be
        // rejected even before its own `exp` claim would have expired it.
        verifyToken: { type: String, select: false },
        verifyTokenExpiry: { type: Date, select: false },
        forgotPasswordToken: { type: String, select: false },
        forgotPasswordTokenExpiry: { type: Date, select: false },
    },
    { timestamps: true }
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User: Model<IUser> =
    mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
