import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {Task } from "../models/task.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const createTask = asyncHandler(async(req,res) => {
    



        const { title, description, dueDate } = req.body;
        
        if (!title || !description || !dueDate) {
            throw new ApiError(400, "All fields are required.");
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            user: req.user._id  
        });

        return res.status(201).json(
            new ApiResponse(201, task, "Task created successfully.")
        );
    


    
});



const getTask  = asyncHandler(async(req,res) => {
    const task = await Task.find({user: req.user.id, _id: req.params.id});  
    if (!task) {
        throw new ApiError(404, "Task not found.");
    }
    return res.status(200).json(
        new ApiResponse(200, task, "Task retrieved successfully.")
    );
});

const updatedAtTask = asyncHandler(async(req,res) => { 
    try {
        const { title, description, dueDate } = req.body;
        const updatedTask = await Task.findOneAndUpdate(

            { _id: req.params.id, user: req.user.id },
            { title, description, dueDate, completed },
            { new: true }
        );
        if (!updatedTask) {
            throw new ApiError(404, "Task not found.");
        }
        return res.status(200).json(
            new ApiResponse(200, updatedTask, "Task updated successfully.")
        );
    } catch (error) {
            throw new ApiError(501,"Somthing went wrong while updating a task. Please try again later.");
        }
});

const deleteTask = asyncHandler(async(req,res) => { 
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedTask) {
            throw new ApiError(404, "Task not found.");
        }
        return res.status(200).json(
            new ApiResponse(200, deletedTask, "Task deleted successfully.")
        );
    } catch (error) {
        throw new ApiError(501,"Somthing went wrong while deleting a task. Please try again later.");
    }
});

export {
    createTask,
    getTask,
    updatedAtTask,
    deleteTask,
};
