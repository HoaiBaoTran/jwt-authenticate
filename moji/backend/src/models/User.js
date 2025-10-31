import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    usernamne: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    avatarUrl: {
        type: String, // link CDN to display image
    },
    avatarId: {
        type: String // Cloudinary public_id to delete image
    },
    bio: {
        type: String,
        maxLength: 500,
    },
    phone: {
        type: String,
        sparse: true // allow null, but must be unique
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;