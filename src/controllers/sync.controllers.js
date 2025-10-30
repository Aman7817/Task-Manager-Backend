import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { SyncQueue } from "../models/syncQueue.model.js";

// Trigger synchronization
const triggerSync = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    // Get pending sync items for this user
    const pendingItems = await SyncQueue.find({ 
        userId: userId, 
        retryCount: { $lt: 3 } 
    }).populate('taskId');

    let syncedCount = 0;
    let failedCount = 0;
    const errors = [];

    // Process in batches
    const batchSize = process.env.SYNC_BATCH_SIZE || 50;
    const batches = [];
    
    for (let i = 0; i < pendingItems.length; i += batchSize) {
        batches.push(pendingItems.slice(i, i + batchSize));
    }

    for (const batch of batches) {
        const batchResults = await Promise.allSettled(
            batch.map(item => processSyncItem(item))
        );

        batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                syncedCount++;
            } else {
                failedCount++;
                errors.push({
                    task_id: batch[index].taskId._id,
                    operation: batch[index].operation,
                    error: result.reason.message,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {
            success: failedCount === 0,
            synced_items: syncedCount,
            failed_items: failedCount,
            errors
        }, "Sync completed successfully")
    );
});

// Get sync status
const getSyncStatus = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const pendingCount = await SyncQueue.countDocuments({ 
        userId: userId, 
        retryCount: { $lt: 3 } 
    });
    
    const lastSyncedTask = await Task.findOne({ 
        userId: userId, 
        syncStatus: 'synced' 
    }).sort({ lastSyncedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, {
            pending_sync_count: pendingCount,
            last_sync_timestamp: lastSyncedTask?.lastSyncedAt || null,
            is_online: true,
            sync_queue_size: pendingCount
        }, "Sync status retrieved successfully")
    );
});

// Process individual sync item
const processSyncItem = async (queueItem) => {
    try {
        if (queueItem.retryCount >= 3) {
            throw new Error('Max retry attempts exceeded');
        }

        // Simulate server API call
        const serverResponse = await simulateServerSync(queueItem);
        
        // Update task with server response
        await Task.findByIdAndUpdate(queueItem.taskId._id, {
            syncStatus: 'synced',
            lastSyncedAt: new Date(),
            serverId: serverResponse.serverId
        });

        // Remove from sync queue
        await SyncQueue.findByIdAndDelete(queueItem._id);

        return { success: true, taskId: queueItem.taskId._id };
    } catch (error) {
        // Increment retry count
        await SyncQueue.findByIdAndUpdate(queueItem._id, {
            $inc: { retryCount: 1 }
        });
        throw error;
    }
};

// Simulate server synchronization
const simulateServerSync = async (queueItem) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate random failures (10% chance) for testing
    if (Math.random() < 0.1) {
        throw new Error('Simulated network failure');
    }

    // Simulate successful server response
    return {
        serverId: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        timestamp: new Date().toISOString()
    };
};

export { triggerSync, getSyncStatus };