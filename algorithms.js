/**
 * Memory Allocation Algorithms
 * First Fit, Best Fit, and Worst Fit implementations
 * Pure JavaScript - No backend needed
 */

/**
 * First Fit Algorithm
 * Allocates each process to the first memory block that can fit it
 */
function firstFit(memoryBlocks, processes) {
    const blocks = memoryBlocks.map(b => ({ size: b, used: 0 }));
    const allocations = [];
    const blockAllocation = new Array(processes.length).fill(-1);
    
    processes.forEach((processSize, processIdx) => {
        let allocated = false;
        
        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            if (blocks[blockIdx].size - blocks[blockIdx].used >= processSize) {
                blockAllocation[processIdx] = blockIdx;
                blocks[blockIdx].used += processSize;
                allocated = true;
                break;
            }
        }
        
        if (allocated) {
            const blockIdx = blockAllocation[processIdx];
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: blockIdx + 1,
                block_size: memoryBlocks[blockIdx],
                status: "Allocated"
            });
        } else {
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: "-",
                block_size: "-",
                status: "Not Allocated"
            });
        }
    });
    
    // Calculate fragmentation
    let internalFrag = 0;
    blockAllocation.forEach((blockIdx, processIdx) => {
        if (blockIdx !== -1) {
            internalFrag += memoryBlocks[blockIdx] - processes[processIdx];
        }
    });
    
    const externalFrag = blocks.reduce((sum, block) => sum + (block.size - block.used), 0);
    
    return {
        allocations,
        internal_fragmentation: internalFrag,
        external_fragmentation: externalFrag,
        block_allocation: blockAllocation
    };
}

/**
 * Best Fit Algorithm
 * Allocates each process to the smallest memory block that can fit it
 */
function bestFit(memoryBlocks, processes) {
    const blocks = memoryBlocks.map(b => ({ size: b, used: 0 }));
    const allocations = [];
    const blockAllocation = new Array(processes.length).fill(-1);
    
    processes.forEach((processSize, processIdx) => {
        let bestBlockIdx = -1;
        let bestBlockSize = Infinity;
        
        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            const available = blocks[blockIdx].size - blocks[blockIdx].used;
            if (available >= processSize && blocks[blockIdx].size < bestBlockSize) {
                bestBlockIdx = blockIdx;
                bestBlockSize = blocks[blockIdx].size;
            }
        }
        
        if (bestBlockIdx !== -1) {
            blockAllocation[processIdx] = bestBlockIdx;
            blocks[bestBlockIdx].used += processSize;
            
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: bestBlockIdx + 1,
                block_size: memoryBlocks[bestBlockIdx],
                status: "Allocated"
            });
        } else {
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: "-",
                block_size: "-",
                status: "Not Allocated"
            });
        }
    });
    
    // Calculate fragmentation
    let internalFrag = 0;
    blockAllocation.forEach((blockIdx, processIdx) => {
        if (blockIdx !== -1) {
            internalFrag += memoryBlocks[blockIdx] - processes[processIdx];
        }
    });
    
    const externalFrag = blocks.reduce((sum, block) => sum + (block.size - block.used), 0);
    
    return {
        allocations,
        internal_fragmentation: internalFrag,
        external_fragmentation: externalFrag,
        block_allocation: blockAllocation
    };
}

/**
 * Worst Fit Algorithm
 * Allocates each process to the largest memory block that can fit it
 */
function worstFit(memoryBlocks, processes) {
    const blocks = memoryBlocks.map(b => ({ size: b, used: 0 }));
    const allocations = [];
    const blockAllocation = new Array(processes.length).fill(-1);
    
    processes.forEach((processSize, processIdx) => {
        let worstBlockIdx = -1;
        let worstBlockSize = -1;
        
        for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
            const available = blocks[blockIdx].size - blocks[blockIdx].used;
            if (available >= processSize && blocks[blockIdx].size > worstBlockSize) {
                worstBlockIdx = blockIdx;
                worstBlockSize = blocks[blockIdx].size;
            }
        }
        
        if (worstBlockIdx !== -1) {
            blockAllocation[processIdx] = worstBlockIdx;
            blocks[worstBlockIdx].used += processSize;
            
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: worstBlockIdx + 1,
                block_size: memoryBlocks[worstBlockIdx],
                status: "Allocated"
            });
        } else {
            allocations.push({
                process_no: processIdx + 1,
                process_size: processSize,
                block_allocated: "-",
                block_size: "-",
                status: "Not Allocated"
            });
        }
    });
    
    // Calculate fragmentation
    let internalFrag = 0;
    blockAllocation.forEach((blockIdx, processIdx) => {
        if (blockIdx !== -1) {
            internalFrag += memoryBlocks[blockIdx] - processes[processIdx];
        }
    });
    
    const externalFrag = blocks.reduce((sum, block) => sum + (block.size - block.used), 0);
    
    return {
        allocations,
        internal_fragmentation: internalFrag,
        external_fragmentation: externalFrag,
        block_allocation: blockAllocation
    };
}
