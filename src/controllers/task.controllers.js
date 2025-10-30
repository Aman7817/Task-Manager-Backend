import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { SyncQueue } from "../models/syncQueue.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async(req,res) => {
    const { title, description, dueDate } = req.body;
    
    if (!title) {
        throw new ApiError(400, "Title is required.");
    }

    const task = await Task.create({
        title,
        description,
        dueDate,
        userId: req.user._id,
        syncStatus: 'pending' // Sync status set
    });

    // Add to sync queue
    await SyncQueue.create({
        taskId: task._id,
        operation: 'create',
        taskData: task,
        userId: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully.")
    );
});

const getTask = asyncHandler(async(req,res) => {
    const task = await Task.findOne({
        _id: req.params.id, 
        userId: req.user._id,
        isDeleted: false
    });  
    
    if (!task) {
        throw new ApiError(404, "Task not found.");
    }
    
    return res.status(200).json(
        new ApiResponse(200, task, "Task retrieved successfully.")
    );
});

const getAllTasks = asyncHandler(async(req,res) => {
    const tasks = await Task.find({
        userId: req.user._id,
        isDeleted: false
    }).sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks retrieved successfully.")
    );
});

const updatedAtTask = asyncHandler(async(req,res) => { 
    try {
        const { title, description, dueDate, completed } = req.body;
        
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { 
                title, 
                description, 
                dueDate, 
                completed,
                syncStatus: 'pending', // Mark for sync
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!updatedTask) {
            throw new ApiError(404, "Task not found.");
        }

        // Add to sync queue
        await SyncQueue.create({
            taskId: updatedTask._id,
            operation: 'update',
            taskData: updatedTask,
            userId: req.user._id
        });

        return res.status(200).json(
            new ApiResponse(200, updatedTask, "Task updated successfully.")
        );
    } catch (error) {
        throw new ApiError(501, "Something went wrong while updating a task. Please try again later.");
    }
});

const deleteTask = asyncHandler(async(req,res) => { 
    try {
        // Soft delete instead of actual delete
        const deletedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { 
                isDeleted: true,
                syncStatus: 'pending',
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!deletedTask) {
            throw new ApiError(404, "Task not found.");
        }

        // Add to sync queue
        await SyncQueue.create({
            taskId: deletedTask._id,
            operation: 'delete',
            taskData: deletedTask,
            userId: req.user._id
        });

        return res.status(200).json(
            new ApiResponse(200, { message: "Task deleted successfully" }, "Task deleted successfully.")
        );
    } catch (error) {
        throw new ApiError(501, "Something went wrong while deleting a task. Please try again later.");
    }
});

export {
    createTask,
    getTask,
    getAllTasks,
    updatedAtTask,
    deleteTask,
};