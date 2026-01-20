# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Gravity Is Real Cool" is a creative coding project that uses physics simulation to create artistic visual patterns. The project simulates gravitational forces between celestial objects using P5.js, where moving objects leave trails as they're influenced by stationary gravitational anchors. The resulting patterns are visually striking and demonstrate physics principles in an engaging way.

## Technology Stack

- **P5.js** (v0.10.2): Creative coding library for canvas-based rendering and animation
- **Vanilla JavaScript**: ES6 classes and vector mathematics
- **HTML5**: Basic structure with WEBGL rendering context
- **CSS3**: Minimal styling for black background aesthetic
- **Glitch**: Originally hosted/developed on Glitch platform

## Development Commands

```bash
# No build process required - this is a static web application

# Run locally - simply open in a web server
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js
npx http-server

# Then navigate to:
# http://localhost:8000 (or appropriate port)
```

## Architecture

This is a client-side only application with a simple architecture:

1. **HTML Entry Point** (`index.html`): Loads P5.js from CDN and the main script
2. **Physics Engine** (`script.js`): Contains the gravity simulation logic
3. **Visual Styling** (`style.css`): Minimal black background styling

The simulation runs entirely in the browser using the P5.js animation loop:
- `setup()`: Initializes canvas and creates celestial objects (stationary gravity wells and moving particles)
- `draw()`: Animation loop that updates physics and renders trails
- `CelestialObject` class: Encapsulates position, velocity, mass, and gravitational calculations

## Key Files

- **script.js** (132 lines): Core application logic
  - `CelestialObject` class (lines 3-69): Physics entity with gravity calculations
  - `setup()` function (lines 75-116): Initializes universe with 3 stationary gravity wells and a 6x6 grid of particles
  - `draw()` function (lines 118-131): Animation loop that updates and renders all objects

- **index.html** (17 lines): Minimal HTML structure loading P5.js v0.10.2 and enabling WEBGL mode

- **style.css** (11 lines): Simple black background with minimal text styling

- **.glitch-assets** (8 lines): Glitch platform metadata (contains one font reference)

## Key Components

### CelestialObject Class
The main entity in the simulation with properties:
- `location`: 3D position vector (x, y, z)
- `velocity`: Current velocity vector
- `mass`: Gravitational mass
- `stationary`: Boolean indicating if object is a gravity well or particle
- `gravModifier`: Damping factor (0.005) to prevent extreme forces

### Gravity Simulation
- Uses simplified Newtonian gravity: F = G * (m1 * m2) / r²
- `everyone_has_gravity` flag (default: false) determines if all objects attract or only stationary ones
- Gravitational force is normalized and scaled by `gravModifier` for visual effect

### Rendering Approach
- Moving objects draw lines from previous to current position (creates trails)
- Line stroke weight is based on velocity magnitude (faster = thicker line)
- Stationary objects are invisible (commented out ellipse drawing)
- Uses WEBGL renderer for potential 3D expansion

## Configuration & Customization

Key parameters to adjust in `script.js`:

```javascript
// Line 1: Enable mutual gravitational attraction
everyone_has_gravity = false;

// Line 9: Gravity strength modifier
this.gravModifier = 0.005;

// Lines 86-96: Stationary gravity well positions
// 3 wells positioned at center, +200, and -200 on y-axis

// Lines 99-115: Particle grid
grid_spacing = 5; // Creates a 6x6 grid of particles
```

## Code Quality Standards

### Observed Patterns
- **Object-Oriented Design**: Physics entities encapsulated in classes
- **Vector Mathematics**: Uses P5.js vector utilities for clean physics calculations
- **Separation of Concerns**: Physics logic separated from rendering logic
- **Performance Optimization**: `p5.disableFriendlyErrors = true` (line 71) for better performance

### Code Style
- ES6 class syntax
- camelCase naming convention
- Descriptive variable names (e.g., `everyone_has_gravity`, `gravModifier`)
- Some commented-out code for 3D features (sphere rendering, perspective)

### Known Characteristics
- No error handling (assumes ideal conditions)
- No user interaction/controls (static simulation)
- Hard-coded initialization values (could be parameterized)
- 3D infrastructure present but unused (WEBGL mode, z-coordinates)

## Potential Enhancement Areas

When modifying this code, consider:
1. **Interactive Controls**: Add sliders for gravity modifier, particle count, etc.
2. **Reset/Pause**: Add buttons to control simulation
3. **Color Variation**: Use color based on velocity or position
4. **3D Visualization**: Enable the commented 3D rendering code
5. **Performance**: The n² gravitational calculations could be optimized for larger particle counts
6. **Configuration**: Externalize magic numbers into configurable constants
