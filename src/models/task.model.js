import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { 
            type: String,
            required: true 
        },
        description: {
             type: String
        },
        completed: {
             type: Boolean, 
             default: false 
        },
        dueDate: {
            type: Date 
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        
        
        syncStatus: { 
            type: String, 
            enum: ['pending', 'synced', 'error'], 
            default: 'pending' 
        },
        serverId: { 
            type: String 
        },
        lastSyncedAt: { 
            type: Date 
        },
        isDeleted: { 
            type: Boolean, 
            default: false 
        }
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model("Task", taskSchema);