# Development Guide

## Prerequisites

### Required
- **Modern Web Browser**: Chrome 60+, Firefox 60+, Safari 12+, or Edge 79+
  - Must support JavaScript ES6 (classes, const/let, arrow functions)
  - Must support WebGL for hardware-accelerated rendering
  - Check WebGL support at: https://get.webgl.org/

- **Text Editor**: Any code editor for modifying files
  - Recommended: VS Code, Sublime Text, Atom, or even Notepad++
  - No special plugins required

### Optional but Recommended
- **Local Web Server**: For proper file serving (browsers may restrict local file:// access)
  - Python 3.x (for `python -m http.server`)
  - Node.js (for `npx http-server`)
  - Or any other static file server

- **Git**: For version control (repository already uses Git)

### Not Required
- No npm/yarn dependencies
- No build tools or bundlers
- No transpilation or compilation
- No package.json or package manager

## Setup

### Quick Setup (< 1 minute)

1. **Clone or Download Repository**
   ```bash
   # Using Git
   git clone <repository-url>
   cd gravity-is-realcool

   # Or download ZIP and extract
   ```

2. **Verify Files**
   ```bash
   ls -la
   # Should see: index.html, script.js, style.css, README.md
   ```

3. **Start Local Server** (Optional but recommended)
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js
   npx http-server -p 8000

   # PHP
   php -S localhost:8000
   ```

4. **Open in Browser**
   ```
   Navigate to: http://localhost:8000
   ```

### Alternative: Direct File Opening

If you don't have a local server:

1. **Open index.html directly in browser**
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

2. **Note**: Some browsers may show CORS warnings or restrictions when loading from file:// protocol

## Development Workflow

### Basic Modification Flow

1. **Edit script.js** in your text editor
2. **Save changes**
3. **Refresh browser** (usually Cmd/Ctrl+R)
4. **Observe results** immediately

No build step, no restart, no waiting. Changes are instant.

### Development Cycle Example

```bash
# 1. Make changes
vim script.js  # or code script.js, etc.

# 2. Save file

# 3. Switch to browser and refresh
# That's it!
```

### Live Reload (Optional Enhancement)

For automatic browser refresh on file changes:

```bash
# Using browser-sync
npx browser-sync start --server --files "*.html, *.js, *.css"

# Using live-server
npx live-server
```

## Testing

### Manual Testing

This project has no automated tests. Testing is done visually:

1. **Visual Verification**: Watch the animation and verify trails are drawing
2. **Performance Check**: Open browser dev tools (F12) and check FPS
   ```javascript
   // Add to draw() function to see FPS
   console.log(frameRate());
   ```
3. **Error Checking**: Open browser console (F12 → Console) and verify no errors

### Debugging Techniques

**1. Console Logging**
```javascript
// In CelestialObject.update() to see forces
console.log(`Force on object: ${this.gravforce.mag()}`);

// In draw() to see frame rate
console.log(`FPS: ${frameRate()}`);
```

**2. Visual Debugging**
```javascript
// In CelestialObject.draw(), uncomment to see stationary objects
if (this.stationary) {
  stroke(0);
  ellipse(this.location.x, this.location.y, this.size, this.size);
}
```

**3. Pausing Simulation**
```javascript
// In draw() function, add condition
if (frameCount > 1000) {
  noLoop();  // Stop after 1000 frames
}
```

**4. Browser Dev Tools**
- **Performance Tab**: Profile rendering performance
- **Console**: View errors and log output
- **Sources Tab**: Set breakpoints in script.js

## Common Tasks

### Change Gravity Strength

**File**: script.js, line 9

```javascript
// Weaker gravity (more chaotic)
this.gravModifier = 0.001;

// Stronger gravity (tighter orbits)
this.gravModifier = 0.01;
```

### Change Number of Particles

**File**: script.js, line 99

```javascript
// Fewer particles (6x6 = 36 total)
let grid_spacing = 5;

// More particles (11x11 = 121 total)
let grid_spacing = 10;

// Warning: Performance degrades quadratically!
```

### Change Particle Colors

**File**: script.js, lines 106-109

```javascript
// Rainbow colors based on position
let r = (i / grid_spacing) * 255;
let g = (j / grid_spacing) * 255;
let b = 128;
let s = new CelestialObject(x, y, z, 0.1, 0.1, false, [r,g,b]);
```

### Enable Mutual Gravity (N-body Simulation)

**File**: script.js, line 1

```javascript
// All objects attract each other (more complex, slower)
let everyone_has_gravity = true;
```

### Clear Trails Periodically

**File**: script.js, in draw() function before translate()

```javascript
// Clear every 500 frames
if (frameCount % 500 === 0) {
  background(0);
}
```

### Change Canvas Size

**File**: script.js, line 76

```javascript
// Full window (current)
createCanvas(windowWidth - 40, windowHeight, WEBGL);

// Fixed size
createCanvas(800, 600, WEBGL);

// Square canvas
let size = Math.min(windowWidth, windowHeight) - 40;
createCanvas(size, size, WEBGL);
```

### Reposition Gravity Wells

**File**: script.js, lines 86-88

```javascript
// Current: Center, top, bottom
universe.push(new CelestialObject(cx, cy, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx, cy + 200, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx, cy - 200, cz, 50, 5, true, [250, 250, 250]));

// Alternative: Triangle formation
universe.push(new CelestialObject(cx, cy - 200, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx - 200, cy + 100, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx + 200, cy + 100, cz, 50, 5, true, [250, 250, 250]));

// Alternative: Four corners
universe.push(new CelestialObject(100, 100, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(width-100, 100, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(100, height-100, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(width-100, height-100, cz, 50, 5, true, [250, 250, 250]));
```

### Add Initial Velocity to Particles

**File**: script.js, lines 109-114 (uncomment and modify)

```javascript
let s = new CelestialObject(x, y, z, 0.1, 0.1, false, [r,g,b]);
let heading = random(0, PI * 2);  // Random direction
s.addThrust(0.1, heading);        // Add small initial velocity
universe.push(s);
```

### Change Background Color

**File**: style.css, line 4

```css
/* Dark blue instead of black */
background: #001122;

/* White background (adjust trail colors too!) */
background: white;
```

**Also update**: script.js, line 79 for canvas initial background

```javascript
background(17, 34);  // Match CSS background
```

### Export/Save Frame as Image

Add this to draw() function:

```javascript
// Save frame when 's' key is pressed
function keyPressed() {
  if (key === 's') {
    saveCanvas('gravity-art', 'png');
  }
}
```

### Performance Monitoring

Add to top of draw() function:

```javascript
// Show FPS in console every 60 frames
if (frameCount % 60 === 0) {
  console.log(`FPS: ${frameRate().toFixed(1)}, Objects: ${universe.length}`);
}
```

## Project Structure

```
gravity-is-realcool/
├── index.html          # Entry point (17 lines)
├── script.js           # Main application logic (132 lines)
├── style.css           # Minimal styling (11 lines)
├── README.md           # Project description
├── .glitch-assets      # Glitch platform metadata
└── .git/               # Git repository
```

## Common Issues & Solutions

### Issue: Blank Black Screen

**Causes**:
1. JavaScript error preventing execution
2. P5.js failed to load from CDN
3. WebGL not supported

**Solutions**:
```bash
# Check browser console (F12) for errors
# Verify P5.js loaded: check Network tab in dev tools
# Test WebGL: visit https://get.webgl.org/
```

### Issue: Performance Degradation

**Causes**:
1. Too many particles (quadratic calculation complexity)
2. Browser tab running in background
3. Hardware limitations

**Solutions**:
```javascript
// Reduce particle count
let grid_spacing = 3;  // 4x4 = 16 particles

// Disable friendly errors (already done on line 71)
p5.disableFriendlyErrors = true;

// Limit frame rate if needed
frameRate(30);  // Add to setup()
```

### Issue: Trails Fill Screen Too Quickly

**Solution**:
```javascript
// Reduce gravity modifier
this.gravModifier = 0.002;  // Slower movement

// Or reduce particle mass
new CelestialObject(x, y, z, 0.05, 0.1, false, [r,g,b]);
```

### Issue: P5.js CDN Offline

**Solution**: Download P5.js locally

```bash
# Download P5.js
curl -o p5.min.js https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.min.js

# Update index.html line 11
<script src="p5.min.js"></script>
```

## Development Tips

1. **Start Small**: Modify one parameter at a time and observe results
2. **Use Console**: Liberally add console.log() to understand behavior
3. **Save Versions**: Keep working versions before major changes
4. **Document Changes**: Comment why you changed values
5. **Performance First**: Test with small particle counts before scaling up
6. **Browser Cache**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) if changes don't appear
7. **Multiple Windows**: Keep browser and editor side-by-side for rapid iteration

## Next Steps

### Beginner Enhancements
- Change colors to create different moods
- Adjust gravity strength for different patterns
- Modify particle starting positions

### Intermediate Enhancements
- Add mouse interaction (attract/repel particles)
- Add UI controls with sliders
- Implement save/load state
- Add reset button
- Create multiple preset patterns

### Advanced Enhancements
- Optimize with spatial partitioning (quadtree)
- Add 3D rendering (infrastructure already present)
- Implement collision detection
- Add particle life spans and regeneration
- Create recording/export functionality
- Add shader effects for visual polish
