/**
 * Dynamic Memory Allocation Simulator - Frontend Script
 * Pure client-side implementation - No backend needed!
 */

// Color palette for processes
const PROCESS_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C4A1'
];

/**
 * Parse comma-separated input and return array of numbers
 */
function parseInput(input) {
    try {
        const values = input.split(',').map(val => {
            const num = parseInt(val.trim());
            if (isNaN(num) || num < 0) {
                throw new Error('Invalid number');
            }
            return num;
        });
        return values.length > 0 ? values : null;
    } catch (error) {
        return null;
    }
}

/**
 * Validate inputs and show error/success messages
 */
function validateInputs() {
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    const memoryInput = document.getElementById('memoryInput').value.trim();
    const processInput = document.getElementById('processInput').value.trim();
    
    if (!memoryInput || !processInput) {
        showError('Please enter both memory blocks and processes');
        return null;
    }
    
    const memoryBlocks = parseInput(memoryInput);
    const processes = parseInput(processInput);
    
    if (!memoryBlocks || !processes) {
        showError('Invalid input format. Please enter positive numbers separated by commas.');
        return null;
    }
    
    if (memoryBlocks.length === 0 || processes.length === 0) {
        showError('Please enter at least one memory block and one process');
        return null;
    }
    
    if (processes.length > 20 || memoryBlocks.length > 20) {
        showError('Maximum 20 memory blocks and 20 processes allowed');
        return null;
    }
    
    return { memory_blocks: memoryBlocks, processes: processes };
}

/**
 * Display error message
 */
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '❌ ' + message;
    errorMsg.style.display = 'block';
}

/**
 * Display success message
 */
function showSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    successMsg.textContent = '✓ ' + message;
    successMsg.style.display = 'block';
}

/**
 * Update summary statistics
 */
function updateSummary(memoryBlocks, processes) {
    const totalMemory = memoryBlocks.reduce((a, b) => a + b, 0);
    const totalProcessSize = processes.reduce((a, b) => a + b, 0);
    
    document.getElementById('totalMemory').textContent = totalMemory;
    document.getElementById('totalProcesses').textContent = processes.length;
    document.getElementById('totalProcessSize').textContent = totalProcessSize;
}

/**
 * Render allocation table for an algorithm
 */
function renderTable(allocations, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';
    
    allocations.forEach(alloc => {
        const row = document.createElement('tr');
        
        if (alloc.status === 'Not Allocated') {
            row.classList.add('status-not-allocated');
        } else {
            row.classList.add('status-allocated');
        }
        
        row.innerHTML = `
            <td>${alloc.process_no}</td>
            <td>${alloc.process_size}</td>
            <td>${alloc.block_allocated}</td>
            <td>${alloc.block_size}</td>
            <td>${alloc.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Render memory visualization with colored blocks
 */
function renderVisualization(memoryBlocks, processes, blockAllocation, vizId) {
    const vizContainer = document.getElementById(vizId);
    vizContainer.innerHTML = '';
    
    // Create reverse mapping: block_idx -> list of processes
    const blockToProcesses = {};
    memoryBlocks.forEach((_, idx) => {
        blockToProcesses[idx] = [];
    });
    
    blockAllocation.forEach((blockIdx, processIdx) => {
        if (blockIdx !== -1) {
            blockToProcesses[blockIdx].push({
                processIdx: processIdx,
                processSize: processes[processIdx]
            });
        }
    });
    
    // Render each memory block
    memoryBlocks.forEach((blockSize, blockIdx) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'memory-block';
        
        // Block header
        const header = document.createElement('div');
        header.className = 'block-header';
        header.textContent = `Block ${blockIdx + 1} (${blockSize} KB)`;
        blockDiv.appendChild(header);
        
        // Block content (allocation visualization)
        const content = document.createElement('div');
        content.className = 'block-content';
        
        const allocatedProcesses = blockToProcesses[blockIdx];
        const totalAllocated = allocatedProcesses.reduce((sum, p) => sum + p.processSize, 0);
        const unallocatedSpace = blockSize - totalAllocated;
        
        if (allocatedProcesses.length === 0) {
            // Empty block
            const slot = document.createElement('div');
            slot.className = 'memory-slot memory-slot-unallocated';
            slot.style.width = '100%';
            slot.textContent = 'Unallocated';
            content.appendChild(slot);
        } else {
            // Render allocated processes
            allocatedProcesses.forEach(proc => {
                const slot = document.createElement('div');
                slot.className = 'memory-slot';
                const percentage = (proc.processSize / blockSize) * 100;
                slot.style.width = percentage + '%';
                slot.style.backgroundColor = PROCESS_COLORS[proc.processIdx % PROCESS_COLORS.length];
                slot.textContent = `P${proc.processIdx + 1}`;
                
                // Add tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'memory-slot-tooltip';
                tooltip.textContent = `Process ${proc.processIdx + 1}: ${proc.processSize} KB`;
                slot.appendChild(tooltip);
                
                content.appendChild(slot);
            });
            
            // Render unallocated space if any
            if (unallocatedSpace > 0) {
                const slot = document.createElement('div');
                slot.className = 'memory-slot memory-slot-unallocated';
                const percentage = (unallocatedSpace / blockSize) * 100;
                slot.style.width = percentage + '%';
                slot.textContent = 'Free';
                
                // Add tooltip for unallocated space
                const tooltip = document.createElement('div');
                tooltip.className = 'memory-slot-tooltip';
                tooltip.textContent = `Unallocated: ${unallocatedSpace} KB`;
                slot.appendChild(tooltip);
                
                content.appendChild(slot);
            }
        }
        
        blockDiv.appendChild(content);
        vizContainer.appendChild(blockDiv);
    });
}

/**
 * Display results for an algorithm
 */
function displayResults(result, memoryBlocks, prefix) {
    // Render allocation table
    const tableId = prefix + 'Table';
    renderTable(result.allocations, tableId);
    
    // Render memory visualization
    const vizId = prefix + 'Viz';
    const processSizes = result.allocations.map(alloc => alloc.process_size);
    renderVisualization(memoryBlocks, processSizes, result.block_allocation, vizId);
    
    // Display fragmentation statistics
    document.getElementById(prefix + 'Internal').textContent = result.internal_fragmentation + ' KB';
    document.getElementById(prefix + 'External').textContent = result.external_fragmentation + ' KB';
}

/**
 * Main function to run the simulation
 */
function runSimulation() {
    try {
        // Validate inputs
        const inputData = validateInputs();
        if (!inputData) {
            return;
        }
        
        // Disable button and show loading state
        const runBtn = document.getElementById('runBtn');
        const originalText = runBtn.innerHTML;
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="spinner-animation">⏳</span> Running...';
        
        // Update summary
        updateSummary(inputData.memory_blocks, inputData.processes);
        
        // Run all three algorithms (client-side!)
        const ffResult = firstFit(inputData.memory_blocks, inputData.processes);
        const bfResult = bestFit(inputData.memory_blocks, inputData.processes);
        const wfResult = worstFit(inputData.memory_blocks, inputData.processes);
        
        // Display results for all three algorithms
        displayResults(ffResult, inputData.memory_blocks, 'firstfit');
        displayResults(bfResult, inputData.memory_blocks, 'bestfit');
        displayResults(wfResult, inputData.memory_blocks, 'worstfit');
        
        // Display fragmentation comparison chart
        const allResults = {
            first_fit: ffResult,
            best_fit: bfResult,
            worst_fit: wfResult
        };
        
        // Only render chart if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            renderFragmentationChart(allResults, inputData.memory_blocks);
        } else {
            console.warn('Chart.js not available, skipping chart rendering');
        }
        
        // Display process allocation flow
        displayProcessFlow(allResults);
        
        // Update comparison table
        updateComparisonTable(allResults, inputData.processes);
        
        // Show success message
        showSuccess('Simulation completed successfully!');
        
        // Re-enable button
        runBtn.disabled = false;
        runBtn.innerHTML = originalText;
        
    } catch (error) {
        showError('Error: ' + error.message);
        const runBtn = document.getElementById('runBtn');
        runBtn.disabled = false;
        runBtn.innerHTML = '<strong>▶ Run Simulation</strong>';
    }
}

/**
 * Reset the form and clear all results
 */
function resetForm() {
    // Reset input fields
    document.getElementById('memoryInput').value = '100, 200, 150';
    document.getElementById('processInput').value = '80, 150, 60';
    
    // Clear summary
    document.getElementById('totalMemory').textContent = '0';
    document.getElementById('totalProcesses').textContent = '0';
    document.getElementById('totalProcessSize').textContent = '0';
    
    // Clear error/success messages
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('successMsg').style.display = 'none';
    
    // Clear all tables
    ['firstfitTable', 'bestfitTable', 'worstfitTable'].forEach(tableId => {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Run simulation to see results</td></tr>';
    });
    
    // Clear visualizations
    ['firstfitViz', 'bestfitViz', 'worstfitViz'].forEach(vizId => {
        const vizDiv = document.getElementById(vizId);
        vizDiv.innerHTML = '<p class="text-muted text-center">Run simulation to see visualization</p>';
    });
    
    // Clear fragmentation stats
    ['firstfitInternal', 'firstfitExternal', 'bestfitInternal', 'bestfitExternal', 
     'worstfitInternal', 'worstfitExternal'].forEach(id => {
        document.getElementById(id).textContent = '0';
    });

    // Clear process flow and charts
    document.getElementById('processFlow').innerHTML = '<p class="text-muted text-center">Run simulation to see process allocation flow</p>';
    
    // Clear comparison table
    const comparisonBody = document.querySelector('#comparisonTable tbody');
    comparisonBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Run simulation to see comparison</td></tr>';
    
    // Destroy existing chart if it exists
    if (window.fragmentationChart && typeof window.fragmentationChart.destroy === 'function') {
        try {
            window.fragmentationChart.destroy();
        } catch (e) {
            console.warn('Chart destroy error:', e);
        }
        window.fragmentationChart = null;
    }
}

/**
 * Render fragmentation comparison chart using Chart.js
 */
function renderFragmentationChart(results, memoryBlocks) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet');
        document.getElementById('fragmentationChart').parentElement.innerHTML = '<p class="text-warning">Chart.js library is loading...</p>';
        return;
    }
    
    const ctx = document.getElementById('fragmentationChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.fragmentationChart && typeof window.fragmentationChart.destroy === 'function') {
        try {
            window.fragmentationChart.destroy();
        } catch (e) {
            console.warn('Chart destroy error:', e);
        }
    }
    
    const algorithms = ['First Fit', 'Best Fit', 'Worst Fit'];
    const internalFragmentation = [
        results.first_fit.internal_fragmentation,
        results.best_fit.internal_fragmentation,
        results.worst_fit.internal_fragmentation
    ];
    const externalFragmentation = [
        results.first_fit.external_fragmentation,
        results.best_fit.external_fragmentation,
        results.worst_fit.external_fragmentation
    ];
    
    try {
        window.fragmentationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: algorithms,
            datasets: [
                {
                    label: 'Internal Fragmentation (KB)',
                    data: internalFragmentation,
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                    borderColor: 'rgba(255, 107, 107, 1)',
                    borderWidth: 2
                },
                {
                    label: 'External Fragmentation (KB)',
                    data: externalFragmentation,
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                    borderColor: 'rgba(78, 205, 196, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Fragmentation Comparison',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    ticks: { font: { size: 11 } },
                    title: {
                        display: true,
                        text: 'Fragmentation (KB)'
                    }
                },
                x: {
                    ticks: { font: { size: 11 } }
                }
            }
        }
        });
    } catch (error) {
        console.error('Error rendering chart:', error);
        showError('Error rendering fragmentation chart: ' + error.message);
    }
}

/**
 * Display process allocation flow step-by-step
 */
function displayProcessFlow(results) {
    const flowContainer = document.getElementById('processFlow');
    flowContainer.innerHTML = '';
    
    let stepCount = 1;
    
    // First Fit flow
    const ffSteps = generateAllocationSteps('First Fit', results.first_fit);
    ffSteps.forEach((step, idx) => {
        const stepEl = createFlowStep(stepCount++, step);
        flowContainer.appendChild(stepEl);
    });
    
    // Best Fit flow
    const bfSteps = generateAllocationSteps('Best Fit', results.best_fit);
    bfSteps.forEach((step, idx) => {
        const stepEl = createFlowStep(stepCount++, step);
        flowContainer.appendChild(stepEl);
    });
    
    // Worst Fit flow
    const wfSteps = generateAllocationSteps('Worst Fit', results.worst_fit);
    wfSteps.forEach((step, idx) => {
        const stepEl = createFlowStep(stepCount++, step);
        flowContainer.appendChild(stepEl);
    });
}

/**
 * Generate allocation steps for display
 */
function generateAllocationSteps(algorithmName, result) {
    const steps = [];
    
    // Summary step for the algorithm
    const allocated = result.allocations.filter(a => a.status === 'Allocated').length;
    const notAllocated = result.allocations.filter(a => a.status === 'Not Allocated').length;
    
    const stepText = `<strong style="font-size: 1.05rem;">${algorithmName}</strong>: ${allocated} allocated, ${notAllocated} not allocated`;
    const details = `
        Internal Fragmentation: ${result.internal_fragmentation} KB<br>
        External Fragmentation: ${result.external_fragmentation} KB<br>
        Total Fragmentation: ${result.internal_fragmentation + result.external_fragmentation} KB
    `;
    
    steps.push({
        title: stepText,
        details: details,
        success: notAllocated === 0,
        isAlgorithm: true
    });
    
    // Individual process allocations
    result.allocations.slice(0, 5).forEach((alloc, idx) => {
        const isAllocated = alloc.status === 'Allocated';
        const title = `Process ${alloc.process_no} (${alloc.process_size} KB)`;
        const details = isAllocated 
            ? `→ Allocated to Block ${alloc.block_allocated} (${alloc.block_size} KB)`
            : `→ Not allocated (no suitable block found)`;
        
        steps.push({
            title: title,
            details: details,
            success: isAllocated,
            isProcess: true
        });
    });
    
    if (result.allocations.length > 5) {
        steps.push({
            title: `... and ${result.allocations.length - 5} more processes`,
            details: `(Total: ${result.allocations.length} processes)`,
            success: true,
            isEllipsis: true
        });
    }
    
    return steps;
}

/**
 * Create a visual flow step element
 */
function createFlowStep(stepNumber, step) {
    const stepEl = document.createElement('div');
    stepEl.className = 'process-step';
    
    if (step.success) {
        stepEl.classList.add('process-step-success');
    } else {
        stepEl.classList.add('process-step-failed');
    }
    
    const statusIcon = step.success ? '✓' : '✗';
    const stepHTML = `
        <div class="process-step-title">
            <span class="step-number">${stepNumber}</span>
            ${step.title} ${statusIcon}
        </div>
        <div class="process-step-details">${step.details}</div>
    `;
    
    stepEl.innerHTML = stepHTML;
    return stepEl;
}

/**
 * Update comparison table
 */
function updateComparisonTable(results, processes) {
    const tbody = document.querySelector('#comparisonTable tbody');
    tbody.innerHTML = '';
    
    const algorithms = [
        { name: 'First Fit', result: results.first_fit },
        { name: 'Best Fit', result: results.best_fit },
        { name: 'Worst Fit', result: results.worst_fit }
    ];
    
    algorithms.forEach(algo => {
        const allocated = algo.result.allocations.filter(a => a.status === 'Allocated').length;
        const notAllocated = algo.result.allocations.filter(a => a.status === 'Not Allocated').length;
        const totalFrag = algo.result.internal_fragmentation + algo.result.external_fragmentation;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${algo.name}</strong></td>
            <td>${algo.result.internal_fragmentation} KB</td>
            <td>${algo.result.external_fragmentation} KB</td>
            <td><strong>${totalFrag} KB</strong></td>
            <td><span class="badge bg-success">${allocated}</span></td>
            <td><span class="badge bg-danger">${notAllocated}</span></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Dynamic Memory Allocation Simulator loaded');
    console.log('✓ All algorithms running client-side (no backend required)');
});

// Allow Enter key to run simulation
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && (event.target.id === 'memoryInput' || event.target.id === 'processInput')) {
        runSimulation();
    }
});
