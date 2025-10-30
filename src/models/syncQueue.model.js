
import mongoose, { Schema } from "mongoose"; 
const syncQueueSchema = new mongoose.Schema(
    {
        taskId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Task", 
            required: true 
        },
        operation: { 
            type: String, 
            enum: ['create', 'update', 'delete'], 
            required: true 
        },
        taskData: { 
            type: Object 
        },
        retryCount: { 
            type: Number, 
            default: 0 
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const SyncQueue = mongoose.model("SyncQueue", syncQueueSchema);