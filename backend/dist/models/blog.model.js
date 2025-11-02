import mongoose, { Schema } from 'mongoose';
// Mongoose Schema
const blogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true,
    },
    tone: {
        type: String,
        enum: ['professional', 'casual', 'technical', 'creative'],
        required: true,
    },
    wordCount: {
        type: Number,
        required: true,
        min: 0,
    },
    readingTime: {
        type: Number,
        required: true,
        min: 0,
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 10;
            },
            message: 'Cannot have more than 10 tags',
        },
    },
    seoScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    exportFormats: {
        markdown: {
            type: String,
        },
        html: {
            type: String,
        },
        pdfUrl: {
            type: String,
        },
    },
    generationParams: {
        model: {
            type: String,
            required: true,
            default: 'gpt-4',
        },
        temperature: {
            type: Number,
            required: true,
            min: 0,
            max: 2,
            default: 0.7,
        },
        maxTokens: {
            type: Number,
            required: true,
            min: 100,
            default: 2000,
        },
    },
}, {
    timestamps: true,
});
// Indexes
blogSchema.index({ userId: 1, createdAt: -1 });
blogSchema.index({ status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ topic: 1 });
// Virtual for calculating reading time from word count
blogSchema.pre('save', function (next) {
    if (this.wordCount) {
        this.readingTime = Math.ceil(this.wordCount / 200); // Average reading speed: 200 words/min
    }
    next();
});
const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
