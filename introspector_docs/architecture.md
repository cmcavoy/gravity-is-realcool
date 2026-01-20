# Architecture

## System Overview

"Gravity Is Real Cool" is a client-side single-page application built on P5.js that runs entirely in the browser. The architecture follows a simple game-loop pattern where physics calculations and rendering occur in a continuous animation cycle.

The system consists of three main layers:
1. **Presentation Layer**: HTML structure and CSS styling
2. **Simulation Engine**: Physics calculations and state management
3. **Rendering Layer**: Canvas drawing using P5.js

There is no backend, no database, and no network communication - everything runs in the browser's JavaScript engine with rendering handled by WebGL.

## Components

### 1. Entry Point (index.html)

**Purpose**: Bootstrap the application and load dependencies

**Responsibilities**:
- Load P5.js library from CDN (v0.10.2)
- Load custom script with defer attribute
- Set viewport and basic meta tags
- Link stylesheet

**Key Details**:
- Minimal HTML - P5.js creates the canvas programmatically
- WEBGL mode enabled through P5.js constructor in script.js
- No body content - everything is rendered on canvas

### 2. Visual Styling (style.css)

**Purpose**: Provide aesthetic foundation for the visualization

**Responsibilities**:
- Set black background (`background: black`)
- Define default font family (Helvetica Neue)
- Apply 20px margin
- Style unused heading elements

**Key Details**:
- Very minimal - only 11 lines
- Most visual effects come from canvas rendering
- Primarily sets up dark aesthetic for contrast with white trails

### 3. CelestialObject Class (script.js, lines 3-69)

**Purpose**: Encapsulate physics entity behavior and properties

**Responsibilities**:
- Store position, velocity, mass, and visual properties
- Calculate gravitational forces from other objects
- Update position based on accumulated forces
- Render trails or markers on canvas

**Key Properties**:
```javascript
location: p5.Vector      // 3D position (x, y, z)
velocity: p5.Vector      // Current velocity vector
gravforce: p5.Vector     // Accumulated gravitational force
mass: number             // Gravitational mass
size: number             // Visual size
stationary: boolean      // Is this a gravity well or particle?
color: [r, g, b]         // RGB color array
gravModifier: 0.005      // Force dampening factor
```

**Key Methods**:

- **gravity(obj)**: Calculate gravitational force from another object
  - Computes direction vector to other object
  - Applies inverse square law: F = G × m₁m₂/r²
  - Normalizes and scales force by gravModifier
  - Adds force to velocity vector

- **move()**: Update position based on current velocity
  - Stores previous location for trail rendering
  - Adds velocity to location

- **update(objs)**: Main update loop
  - Iterates through all objects
  - Applies gravitational forces based on `everyone_has_gravity` flag
  - Calls move() if object is not stationary

- **draw()**: Render visual representation
  - For moving objects: draws line from previous to current position
  - Line stroke weight based on velocity magnitude
  - Stationary objects have rendering commented out

### 4. Universe Array (script.js, line 73)

**Purpose**: Central data structure holding all simulation objects

**Responsibilities**:
- Store all CelestialObject instances
- Provide iteration target for update and render loops

**Structure**:
- Simple JavaScript array
- Initially populated in setup()
- Contains both stationary gravity wells and moving particles

### 5. Setup Function (script.js, lines 75-116)

**Purpose**: Initialize the simulation state and canvas

**Responsibilities**:
- Create canvas with WEBGL renderer
- Set black background
- Create 3 stationary gravity wells
- Create 6 initial moving objects (later overridden)
- Generate 6×6 grid of particles (36 total)

**Initialization Details**:

**Gravity Wells** (3 stationary objects):
```javascript
universe.push(new CelestialObject(cx, cy, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx, cy + 200, cz, 50, 5, true, [250, 250, 250]));
universe.push(new CelestialObject(cx, cy - 200, cz, 50, 5, true, [250, 250, 250]));
```
- Positioned at center (cx, cy), 200px above, and 200px below
- Mass: 50
- Stationary: true (don't move, but exert gravitational force)

**Particle Grid** (36 objects):
```javascript
for (let i=0; i<=grid_spacing; i++) {
  for (let j=0; j<=grid_spacing; j++) {
    let x = j * space_between;
    let y = i * space_between;
    universe.push(new CelestialObject(x, y, z, 0.1, 0.1, false, [r,g,b]));
  }
}
```
- Grid spacing: 5 (creates 6×6 = 36 particles)
- Mass: 0.1 (much lighter than gravity wells)
- Stationary: false (affected by gravity)
- Evenly distributed across canvas

### 6. Draw Function (script.js, lines 118-131)

**Purpose**: Animation loop that updates and renders the universe

**Responsibilities**:
- Adjust coordinate system for WEBGL mode
- Update all objects (physics calculations)
- Render all objects (draw trails)
- Execute continuously at ~60 FPS

**Key Details**:
```javascript
translate(-width/2, -height/2, 0);  // Adjust for WEBGL coordinate system
for (const i in universe) {
  universe[i].update(universe);      // Physics update
  universe[i].draw();                // Render
}
```

**No Background Clear**: The background is NOT cleared each frame, allowing trails to persist and build up over time, creating the artistic effect.

## Data Flow

### Initialization Flow
```
1. Browser loads index.html
   ↓
2. P5.js library loads from CDN
   ↓
3. script.js loads (deferred)
   ↓
4. P5.js calls setup()
   ↓
5. Canvas created (windowWidth-40 × windowHeight, WEBGL mode)
   ↓
6. Universe array populated with:
   - 3 stationary gravity wells
   - 36 moving particles in 6×6 grid
   ↓
7. P5.js begins calling draw() at ~60 FPS
```

### Animation Loop (Each Frame)
```
draw() called by P5.js
   ↓
Adjust coordinate system (translate for WEBGL)
   ↓
For each object in universe:
   │
   ├─→ update(universe):
   │    ├─→ For each other object:
   │    │    └─→ If gravity applies:
   │    │         └─→ Calculate gravitational force
   │    │              └─→ Add to velocity
   │    └─→ If not stationary:
   │         └─→ move(): Update position
   │
   └─→ draw():
        └─→ If moving: Draw line from previous to current position
             (Stroke weight based on velocity)
```

### Gravitational Force Calculation Flow
```
Object A.update(universe):
   ↓
For each Object B in universe:
   ↓
Check gravity rules:
   - If everyone_has_gravity = false: Only stationary objects affect moving ones
   - If everyone_has_gravity = true: All objects affect each other
   ↓
If gravity applies:
   ↓
Calculate direction vector (B.location - A.location)
   ↓
Calculate distance (r = direction.magnitude())
   ↓
Apply inverse square law: F = G × (massA × massB) / r²
   ↓
Normalize force vector
   ↓
Scale by gravModifier (0.005)
   ↓
Add to velocity vector (velocity += force)
```

## External Dependencies

### P5.js (v0.10.2)

**Purpose**: Creative coding framework providing canvas abstraction and utilities

**Loaded From**: CDN (https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.js)

**Used Features**:
- `createCanvas(width, height, WEBGL)`: Canvas creation with WebGL renderer
- `createVector(x, y, z)`: Vector math utilities
- `setup()` and `draw()` lifecycle hooks
- Vector methods: `.add()`, `.sub()`, `.mult()`, `.normalize()`, `.mag()`, `.copy()`, `.rotate()`
- Drawing functions: `background()`, `fill()`, `stroke()`, `strokeWeight()`, `line()`, `translate()`
- Built-in variables: `windowWidth`, `windowHeight`

**Version Lock**: Pinned to v0.10.2 (released ~2019)

**Note**: No local P5.js installation - relies on CDN availability

### Browser APIs

**WebGL**: Hardware-accelerated 3D graphics (via P5.js WEBGL mode)
- Currently used for 2D rendering but infrastructure present for 3D
- Provides better performance than 2D canvas for complex animations

**requestAnimationFrame**: Implicit through P5.js draw() loop
- Provides smooth 60 FPS animation
- Automatically pauses when tab is inactive

## Architectural Characteristics

### Strengths
- **Simple**: No build process, no bundler, no transpilation
- **Self-contained**: All code in single JavaScript file
- **Fast**: Hardware acceleration via WebGL
- **Accessible**: Can be modified with basic text editor
- **Educational**: Clear separation of physics and rendering

### Limitations
- **Performance Ceiling**: O(n²) gravity calculations limit particle count
- **No Interactivity**: No user controls or input handling
- **Single File**: All logic in one file (could benefit from modules for larger projects)
- **Hard-coded Values**: Configuration requires code modification
- **No State Persistence**: Cannot save/load simulation states

### Scalability Considerations
- Current 39 objects (3 wells + 36 particles) = 1,404 gravity calculations per frame
- At 60 FPS: ~84,000 calculations per second
- Performance degrades quadratically with particle count
- For 100 particles: ~10,000 calculations per frame (600,000/sec) - likely to impact framerate
- Optimization strategies needed for larger simulations (spatial partitioning, approximate gravity)
