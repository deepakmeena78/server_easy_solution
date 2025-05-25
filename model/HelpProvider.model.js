import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
    help: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Help",
        required: true
    },
    help_seeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    offerd_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "apply", "accepted", "cancel", "not_accepted", "rejected", "completed"],
        default: "pending"
    },
    time_line: {
        type: Array,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

const HelpProvider = mongoose.model("helpprovider", ProviderSchema);
export default HelpProvider;
