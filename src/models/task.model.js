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
        
        
    },
    {
        timestamps: true
    },
    
    
);

export const  Task = mongoose.model("Task", taskSchema);