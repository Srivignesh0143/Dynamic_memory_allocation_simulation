# Dynamic Memory Allocation Simulator

A **fully client-side** interactive web application that demonstrates memory allocation algorithms without requiring any backend server.

## ⚡ Quick Start (No Backend Needed!)

Simply open `frontend/index.html` in any modern web browser. That's it!

### Option 1: Direct File Open
1. Navigate to the `frontend` folder
2. Double-click `index.html`
3. Done! The simulator is running locally

### Option 2: Using Python HTTP Server (Recommended)
```bash
cd frontend
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## 📋 Overview

This project demonstrates how memory allocation works using three fundamental algorithms:
- **First Fit**: Allocates to the first suitable block
- **Best Fit**: Allocates to the smallest suitable block  
- **Worst Fit**: Allocates to the largest suitable block

## ✨ Features

✅ **Three Memory Allocation Algorithms** (all JavaScript)
- Fast, instant execution
- No server calls needed
- Works offline

✅ **Interactive Dashboard**
- Clean Bootstrap UI
- Tabbed results display
- Real-time computation

✅ **Rich Visualizations**
- Color-coded memory blocks
- Allocation tables with detailed info
- Fragmentation statistics

✅ **Fragmentation Comparison Chart**
- Visual comparison of internal vs external fragmentation
- Chart.js powered bar chart
- Compare all three algorithms at once

✅ **Process Flow Visualization**
- Step-by-step allocation process display
- Shows success/failure for each process
- Algorithm summary with statistics

✅ **Algorithms Comparison Table**
- Side-by-side comparison of all three algorithms
- Fragmentation metrics
- Process allocation counts

✅ **Input Validation**
- Prevents negative values
- User-friendly error messages
- Reasonable input limits

✅ **100% Client-Side**
- No backend required
- No network latency
- Works offline
- No server to set up

## 📁 Project Structure

```
Dynamic-Memory-Allocation-Simulator/
│
└── frontend/
    ├── index.html          # Main HTML file
    ├── css/
    │   └── style.css       # Custom styling
    └── js/
        ├── algorithms.js   # Memory allocation algorithms
        └── script.js       # Application logic
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Bootstrap 5 framework + custom animations
- **JavaScript (ES6+)** - Pure client-side implementation
- **Chart.js** - Beautiful fragmentation comparison charts
- **No backend required!**

## 📖 How to Use

1. **Enter Memory Blocks**: Comma-separated sizes (e.g., `100, 200, 150`)
2. **Enter Processes**: Comma-separated sizes (e.g., `80, 150, 60`)
3. **Click "Run Simulation"**
4. **View Results**: Switch between tabs to see different algorithms

### Example

**Input:**
- Memory Blocks: `100, 200, 150`
- Processes: `80, 150, 60`

**Results:**
- First Fit allocates P1→Block1, P2→Block2, P3→Block3
- Best Fit minimizes internal fragmentation
- Worst Fit spreads processes across larger blocks

## 💡 Understanding the Results

### Allocation Table
- **Process No**: Process identifier
- **Process Size**: How much memory the process needs
- **Block Allocated**: Which memory block it was assigned to
- **Block Size**: Original size of that block
- **Status**: Allocated or Not Allocated (shown in red)

### Fragmentation

**Internal Fragmentation**: Wasted space WITHIN allocated blocks
- Calculated as: (Block Size - Process Size) for each allocation
- Higher = more wasted space inside blocks

**External Fragmentation**: Wasted space in free blocks
- Total unused memory that couldn't fit any processes
- Higher = more fragmented free memory

### Memory Visualization

- **Colored sections**: Allocated processes (each has unique color)
- **Gray sections**: Unallocated (free) memory
- **Hover over**: See process ID and size
- **Block headers**: Show block number and size

### Process Flow Visualization
After running the simulation, you'll see a **step-by-step process flow** showing:
- How each algorithm processes allocations
- ✓ Green steps = successful allocations
- ✗ Red steps = failed allocations
- Summary statistics for each algorithm
- Individual process details

### Fragmentation Comparison Chart
A **visual bar chart** displays:
- Internal fragmentation (red bars) for each algorithm
- External fragmentation (teal bars) for each algorithm
- Easy comparison of algorithm efficiency
- Higher bars = more wasted memory

### Algorithms Comparison Table
A **summary table** showing:
- Internal & external fragmentation for each algorithm
- Total fragmentation values
- Number of processes allocated/not allocated
- Quick visual comparison with color badges

## 🔬 Algorithm Details

### First Fit
```
For each process:
  Scan blocks from beginning
  Allocate to FIRST block that fits
  Move to next process
```
✓ Fastest allocation
✓ Good for general use

### Best Fit
```
For each process:
  Find SMALLEST block that fits
  Allocate to that block
  Move to next process
```
✓ Minimizes internal fragmentation
✓ Slower than First Fit

### Worst Fit
```
For each process:
  Find LARGEST block that fits
  Allocate to that block
  Move to next process
```
✓ Reduces external fragmentation
✓ May leave odd-sized holes

## 🚀 Performance

All algorithms run **instantly** in the browser:
- ✅ No server requests
- ✅ No network latency
- ✅ Works offline
- ✅ Instant feedback

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

## ❓ FAQ

**Q: Do I need to install anything?**
A: No! Just open the HTML file in a browser.

**Q: Does it work without internet?**
A: Yes! It's 100% client-side (except Bootstrap CDN).

**Q: Can I modify the algorithms?**
A: Yes! Edit `frontend/js/algorithms.js`

**Q: Why are some processes not allocated?**
A: When no available block is large enough for the process.

**Q: What's the difference between internal and external fragmentation?**
A: Internal = wasted space in allocated blocks; External = wasted space in free blocks.

**Q: Maximum processes/blocks?**
A: Currently 20 each. Change `validateInputs()` if needed.

## 🎓 Learning

This simulator helps understand:
- Operating system memory management
- Fragmentation concepts
- Algorithm trade-offs
- Real-world allocation challenges

## 📝 Files Explained

| File | Purpose |
|------|---------|
| `index.html` | Main UI with Bootstrap layout |
| `css/style.css` | Responsive styling and animations |
| `js/algorithms.js` | First Fit, Best Fit, Worst Fit implementations |
| `js/script.js` | Input validation, rendering, event handling |

## 🔧 Customization

### Change Default Input Values
Edit the `value` attribute in `index.html`:
```html
<input value="100, 200, 150">  <!-- Modify these -->
```

### Add More Colors
Edit `PROCESS_COLORS` in `script.js`:
```javascript
const PROCESS_COLORS = [
    '#FF6B6B', '#4ECDC4', ...  // Add more hex colors
];
```

### Modify Algorithm Logic
Edit the functions in `algorithms.js`:
```javascript
function firstFit(memoryBlocks, processes) {
    // Your custom implementation
}
```

## 📊 Examples

### Example 1: Perfect Fit
```
Memory: 100, 100, 100
Processes: 100, 100, 100
Result: All allocated, zero fragmentation
```

### Example 2: Fragmentation
```
Memory: 200
Processes: 50, 50, 50
Result: 50KB internal fragmentation (Best/First), 
        0KB external (all space used)
```

### Example 3: Allocation Failure
```
Memory: 100, 50
Processes: 100, 100, 100
Result: First process allocates, second to block 2,
        third fails (not allocated)
```

## ✅ What Works

✓ All three algorithms implemented correctly
✓ Fragmentation calculations accurate
✓ Visual memory representation
✓ Input validation
✓ Error handling
✓ Responsive design
✓ Offline capability
✓ No dependencies (except Bootstrap CDN)

## 🚫 Known Limitations

- Bootstrap requires CDN (optional)
- Max 20 blocks/processes (by design)
- Simplified allocation model (no compaction/defragmentation)

## 📄 License

Open source for educational purposes.

## 👤 Author

Created as an interactive educational tool for OS concepts.

---

**Enjoy learning!** 🎓 Open `index.html` and start simulating!
