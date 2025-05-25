import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Costomer",
        required: true
    },
    givenTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Costomer",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const ReviewModule = mongoose.model("Review", ReviewSchema);
export default ReviewModule;