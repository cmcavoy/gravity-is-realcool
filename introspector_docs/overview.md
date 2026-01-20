# Gravity Is Real Cool - Overview

## Purpose

"Gravity Is Real Cool" is a creative coding project that demonstrates physics simulation for artistic purposes. The project simulates Newtonian gravity between celestial objects to create mesmerizing visual patterns. As particles are influenced by gravitational forces from stationary "wells," they trace elegant paths that evolve into complex, organic-looking patterns.

This is both an educational tool for understanding gravitational physics and a generative art piece that produces unique visualizations based on initial conditions.

## Key Features

- **Real-time Physics Simulation**: Implements simplified Newtonian gravity (F = G × m₁m₂/r²) with vector mathematics
- **Visual Trail Rendering**: Moving objects leave persistent trails that create artistic patterns
- **Configurable Gravity Wells**: Three stationary objects exert gravitational pull on surrounding particles
- **Dynamic Line Weights**: Trail thickness varies with velocity, creating visual emphasis on faster movement
- **Grid-based Particle System**: A 6×6 grid of particles (36 particles) creates a uniform starting distribution
- **WEBGL Rendering**: Uses hardware-accelerated rendering for smooth animation
- **Performance Optimized**: P5.js friendly errors disabled for better frame rates

## Target Audience

### Primary Users
- **Creative Coders**: Developers interested in generative art and physics-based visualizations
- **Educators**: Teachers demonstrating gravitational physics concepts in an engaging way
- **Students**: Learners studying physics, mathematics, or computer graphics
- **Digital Artists**: Artists exploring algorithmic/generative art techniques

### Technical Level
- Beginner to intermediate JavaScript developers
- Anyone with basic understanding of HTML/CSS/JavaScript
- No complex build tools or frameworks required
- Accessible entry point for learning P5.js and physics programming

## Quick Start

### Prerequisites
- Modern web browser with JavaScript and WebGL support
- Text editor (for code modifications)
- Local web server (optional but recommended)

### Running the Project

**Option 1: Direct File Opening** (may have limitations)
```bash
# Simply open index.html in a web browser
open index.html
```

**Option 2: Local Web Server** (recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server -p 8000

# Then navigate to: http://localhost:8000
```

### Basic Customization

Edit `script.js` to customize the simulation:

**Change gravity strength:**
```javascript
// Line 9 in CelestialObject constructor
this.gravModifier = 0.005; // Increase for stronger gravity
```

**Change particle count:**
```javascript
// Line 99 in setup()
let grid_spacing = 5; // Increase for more particles (creates (n+1)² particles)
```

**Enable mutual gravity:**
```javascript
// Line 1
let everyone_has_gravity = true; // All objects attract each other
```

### What You'll See

When you load the page, you'll see:
1. A black canvas fills the browser window
2. A 6×6 grid of white particles begins moving
3. Particles are pulled by three invisible gravity wells (center, top, bottom)
4. White trails trace the particle paths, creating evolving patterns
5. The simulation runs continuously, building up complex visual textures

The pattern will evolve uniquely each time based on the exact timing and interactions between particles and gravity wells.

## Project Origin

This project was originally created on Glitch, a collaborative coding platform. The `.glitch-assets` file contains metadata from that platform. The project demonstrates the accessibility of creative coding - a complex physics simulation and generative art piece created with minimal code and dependencies.
