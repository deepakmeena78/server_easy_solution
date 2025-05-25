import mongoose from "mongoose";

const HelpSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    help_seeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Costomer",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    gallery: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancel"],
        default: "pending"
    },
    help_date: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

const Help = mongoose.model("Help", HelpSchema);
export default Help;
