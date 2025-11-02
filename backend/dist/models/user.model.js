import mongoose, { Schema } from 'mongoose';
// Mongoose Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't return password by default
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
    },
    apiUsage: {
        blogsGenerated: {
            type: Number,
            default: 0,
        },
        wordsGenerated: {
            type: Number,
            default: 0,
        },
        lastReset: {
            type: Date,
            default: Date.now,
        },
    },
    preferences: {
        defaultTone: {
            type: String,
            enum: ['professional', 'casual', 'technical', 'creative'],
            default: 'professional',
        },
        defaultLength: {
            type: Number,
            default: 1000,
            min: 500,
            max: 3000,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
}, {
    timestamps: true,
});
// Indexes
userSchema.index({ email: 1 });
userSchema.index({ plan: 1 });
// Methods (can be added here)
// userSchema.methods.comparePassword = async function(password: string) { ... }
const User = mongoose.model('User', userSchema);
export default User;
