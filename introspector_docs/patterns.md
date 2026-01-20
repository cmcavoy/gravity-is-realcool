# Code Patterns and Best Practices

This document describes the design patterns, coding conventions, and best practices observed in the "Gravity Is Real Cool" codebase.

## Design Patterns

### 1. Entity-Component Pattern (Simplified)

**Location**: script.js, lines 3-69 (CelestialObject class)

**Description**: The `CelestialObject` class encapsulates both data (properties) and behavior (methods) for physics entities. Each object is self-contained with its own state and logic.

**Implementation**:
```javascript
class CelestialObject {
  constructor(x, y, z, mass, size, stationary, color) {
    // Properties (data)
    this.location = createVector(x, y, z);
    this.velocity = createVector(0, 0);
    this.mass = mass;
    this.stationary = stationary;

    // Methods (behavior)
  }

  gravity(obj) { /* Calculate forces */ }
  move() { /* Update position */ }
  update(objs) { /* Main loop */ }
  draw() { /* Render */ }
}
```

**Benefits**:
- Clear separation of concerns
- Easy to add new object types
- Self-documenting code structure
- Encapsulated state prevents bugs

### 2. Game Loop Pattern

**Location**: script.js, lines 75-131 (setup/draw functions)

**Description**: Classic game loop with initialization phase (setup) and continuous update/render cycle (draw). P5.js manages the loop execution.

**Implementation**:
```javascript
function setup() {
  // Initialize once
  createCanvas(windowWidth - 40, windowHeight, WEBGL);
  // Create all game objects
  universe.push(new CelestialObject(...));
}

function draw() {
  // Update physics
  for (const i in universe) {
    universe[i].update(universe);
  }

  // Render
  for (const i in universe) {
    universe[i].draw();
  }
}
```

**Benefits**:
- Clear lifecycle phases
- Consistent frame timing
- Separation of initialization and runtime logic
- Standard pattern familiar to game developers

### 3. Central State Container

**Location**: script.js, line 73 (universe array)

**Description**: Single array holding all simulation entities. This provides a central source of truth for application state.

**Implementation**:
```javascript
let universe = [];

// In setup(): populate state
universe.push(new CelestialObject(...));

// In draw(): iterate state
for (const i in universe) {
  universe[i].update(universe);
}
```

**Benefits**:
- Single source of truth
- Easy to iterate all objects
- Simple state management
- No complex data structures needed

### 4. Strategy Pattern (Simplified)

**Location**: script.js, line 1 and lines 43-48

**Description**: The `everyone_has_gravity` flag modifies gravity calculation strategy at runtime without changing code structure.

**Implementation**:
```javascript
// Configuration flag
let everyone_has_gravity = false;

// Strategy selection in update()
update(objs) {
  for (let i=0; i<objs.length; i++) {
    if (!everyone_has_gravity && objs[i].stationary && !this.stationary) {
      this.gravity(objs[i]);  // Strategy A: Only stationary affect moving
    }
    else if (everyone_has_gravity && objs[i] != this) {
      this.gravity(objs[i]);  // Strategy B: All affect all (N-body)
    }
  }
}
```

**Benefits**:
- Easy to switch behaviors
- No code duplication
- Clear configuration point
- Runtime flexibility

### 5. Immediate Mode Rendering

**Location**: script.js, lines 55-68 (draw method)

**Description**: Drawing commands executed every frame without retained scene graph. Each frame is drawn from scratch based on current state.

**Implementation**:
```javascript
draw() {
  // No background clear - trails persist
  fill(this.color);
  stroke(this.color);
  strokeWeight(this.velocity.mag() * this.size * 0.5);
  line(this.location.x, this.location.y,
       this.previousLocation.x, this.previousLocation.y);
}
```

**Benefits**:
- Simple mental model
- No complex scene management
- Artistic effect (persistent trails)
- Direct control over rendering

## Common Patterns

### 1. Vector Mathematics

**Pattern**: Extensive use of P5.js vector utilities for clean physics calculations

**Examples**:
```javascript
// Vector creation
this.location = createVector(x, y, z);
this.velocity = createVector(0, 0);

// Vector operations
let dir = obj.location.copy().sub(this.location);  // Direction
let r = dir.mag();                                  // Distance
dir.normalize();                                    // Unit vector
this.velocity.add(this.gravforce);                 // Accumulation
```

**Benefits**:
- Clean, readable physics code
- No manual x/y/z coordinate manipulation
- Prevents common vector math bugs
- Self-documenting code

### 2. Method Chaining

**Pattern**: P5.js vectors support method chaining for fluent API

**Example**:
```javascript
// Chain vector operations
let dir = obj.location.copy().sub(this.location);

// Instead of:
let dir = obj.location.copy();
dir.sub(this.location);
```

**Benefits**:
- More concise code
- Functional programming style
- Easier to read complex operations

### 3. Copy-on-Use for Vectors

**Pattern**: Always copy vectors before modifying to prevent unintended mutations

**Example**:
```javascript
// GOOD: Copy before modifying
let dir = obj.location.copy().sub(this.location);

// BAD: Would modify obj.location!
// let dir = obj.location.sub(this.location);

// GOOD: Store previous location
this.previousLocation = this.location.copy();

// BAD: Would create reference, not copy
// this.previousLocation = this.location;
```

**Benefits**:
- Prevents subtle bugs
- Clear data ownership
- Predictable behavior

### 4. Self-Reference Exclusion

**Pattern**: Objects exclude themselves from calculations using identity check

**Example**:
```javascript
update(objs) {
  for (let i=0; i<objs.length; i++) {
    if (objs[i] != this) {  // Don't apply gravity to self
      this.gravity(objs[i]);
    }
  }
}
```

**Benefits**:
- Prevents self-interaction bugs
- Clear intent
- Simple implementation

### 5. Conditional Rendering

**Pattern**: Different rendering based on object state

**Example**:
```javascript
draw() {
  if (!this.stationary) {
    // Moving objects: draw trails
    strokeWeight(this.velocity.mag() * this.size * 0.5);
    line(this.location.x, this.location.y,
         this.previousLocation.x, this.previousLocation.y);
  }
  if (this.stationary) {
    // Stationary objects: invisible (commented out)
    // ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
```

**Benefits**:
- Different visual representation for different roles
- Flexible rendering
- Easy to modify per object type

### 6. Configuration via Constructor

**Pattern**: Objects configured through constructor parameters

**Example**:
```javascript
// Stationary gravity well
new CelestialObject(cx, cy, cz, 50, 5, true, [250, 250, 250]);

// Moving particle
new CelestialObject(x, y, z, 0.1, 0.1, false, [r, g, b]);
```

**Benefits**:
- Clear initialization
- Reusable class for different roles
- Easy to create variations

### 7. Guard Clauses

**Pattern**: Early returns/skips to reduce nesting

**Example**:
```javascript
update(objs) {
  for (let i=0; i<objs.length; i++) {
    // Guard: skip if rules don't apply
    if (!everyone_has_gravity && objs[i] != this && objs[i].stationary && !this.stationary) {
      this.gravity(objs[i]);
    }
  }

  // Guard: skip move if stationary
  if (!this.stationary) {
    this.move();
  }
}
```

**Benefits**:
- Reduces nesting
- Clearer logic flow
- Easier to understand conditions

## Best Practices

### 1. Performance Optimization

**Practice**: Disable P5.js friendly errors in production

**Location**: script.js, line 71

```javascript
p5.disableFriendlyErrors = true;
```

**Reasoning**: Friendly errors add overhead for development help. Disabling improves performance for production/art pieces.

### 2. Magic Number Documentation

**Practice**: Use descriptive variable names for constants

**Example**:
```javascript
this.gravModifier = 0.005; // chill it out
```

**Better Practice**:
```javascript
const GRAVITY_DAMPENING = 0.005;  // Prevents extreme forces
this.gravModifier = GRAVITY_DAMPENING;
```

**Current State**: Some magic numbers lack clear documentation (could be improved)

### 3. Separation of Update and Render

**Practice**: Physics updates separate from rendering

**Implementation**:
```javascript
draw() {
  for (const i in universe) {
    universe[i].update(universe);  // Physics
    universe[i].draw();            // Rendering
  }
}
```

**Benefits**:
- Clear separation of concerns
- Easier to debug each phase
- Could run at different rates if needed

### 4. Coordinate System Handling

**Practice**: Explicit coordinate transformation for WEBGL

**Location**: script.js, line 120

```javascript
translate(-width/2, -height/2, 0);  // Adjust for WEBGL origin
```

**Reasoning**: WEBGL places origin at center, translation moves it to top-left to match expectations

### 5. State Preservation

**Practice**: Store previous state for trail rendering

**Example**:
```javascript
move() {
  this.previousLocation = this.location.copy();  // Save before moving
  this.location.add(this.velocity);              // Update position
}
```

**Benefits**:
- Enables trail rendering
- Provides velocity visualization
- Simple history mechanism

### 6. Force Normalization

**Practice**: Normalize forces before applying

**Example**:
```javascript
gravity(obj) {
  let f = this.G * ((obj.mass * this.mass) / (r * r));
  this.gravforce = dir.copy().mult(f);
  this.gravforce.normalize();              // Normalize direction
  this.gravforce.mult(this.gravModifier);  // Scale by modifier
  this.velocity.add(this.gravforce);       // Apply to velocity
}
```

**Reasoning**: Prevents extreme force values, provides better control over simulation behavior

### 7. RGB Color Arrays

**Practice**: Use arrays for colors instead of P5.js color objects

**Example**:
```javascript
this.color = [250, 250, 250];  // RGB array

draw() {
  fill(this.color);
  stroke(this.color);
}
```

**Benefits**:
- Simple and lightweight
- Works with P5.js fill/stroke
- Easy to manipulate programmatically

## Anti-Patterns and Code Smells

### 1. Commented-Out Code

**Location**: Lines 64, 112-114, 119, 121-123, 128-130

**Issue**: Multiple sections of commented code left in place

**Example**:
```javascript
// if (this.stationary) {
//   stroke(0);
//   ellipse(this.location.x, this.location.y, this.size, this.size);
// }
```

**Impact**: Clutters code, unclear if features are abandoned or experimental

**Recommendation**: Remove unused code or clearly document why it's commented

### 2. Global State

**Location**: Line 1 (`everyone_has_gravity`), Line 73 (`universe`)

**Issue**: Global variables for configuration and state

**Impact**: Makes testing harder, potential for accidental modification

**Current Use**: Acceptable for small project, but could cause issues if scaled

**Better Approach** (for larger projects):
```javascript
class Simulation {
  constructor() {
    this.everyoneHasGravity = false;
    this.universe = [];
  }
}
```

### 3. Hard-Coded Values

**Issue**: Many magic numbers embedded in code

**Examples**:
- Gravity modifier: 0.005
- Grid spacing: 5
- Gravity well positions: 200
- Particle mass: 0.1
- Canvas margin: 40

**Impact**: Hard to experiment with different configurations

**Recommendation**: Extract to configuration object:
```javascript
const CONFIG = {
  GRAVITY_MODIFIER: 0.005,
  GRID_SPACING: 5,
  WELL_DISTANCE: 200,
  PARTICLE_MASS: 0.1,
  CANVAS_MARGIN: 40
};
```

### 4. Array Iteration Pattern

**Location**: Lines 42, 124

**Issue**: Using `for...in` with arrays (iterates over indices as strings)

**Example**:
```javascript
for (const i in universe) {  // i is string, not number
  universe[i].update(universe);
}
```

**Better Practice**:
```javascript
for (const obj of universe) {
  obj.update(universe);
}

// Or for traditional loop:
for (let i = 0; i < universe.length; i++) {
  universe[i].update(universe);
}
```

**Current Impact**: Minimal (works correctly), but non-idiomatic

## Architectural Decisions

### Decision 1: No Background Clear

**Choice**: Not clearing background each frame (no `background()` call in draw)

**Effect**: Trails persist and build up over time

**Tradeoff**: Creates artistic effect but limits control over visual appearance

**Alternative**: Clear background periodically or with fade effect

### Decision 2: Single Update/Render Loop

**Choice**: Both update and render in same loop iteration

**Benefits**: Simplicity, synchronized state

**Tradeoff**: Can't easily run physics at different rate than rendering

### Decision 3: Velocity-Based Line Weight

**Choice**: `strokeWeight(this.velocity.mag() * this.size * 0.5)`

**Effect**: Faster particles draw thicker lines

**Benefits**: Visual feedback for speed, artistic effect

### Decision 4: WEBGL Renderer

**Choice**: Using WEBGL mode despite 2D rendering

**Benefits**: Better performance, infrastructure for 3D expansion

**Tradeoff**: More complex coordinate system, overkill for current 2D use

### Decision 5: Simplified Physics

**Choice**: Using modified inverse square law with dampening

**Benefits**: Artistic control, prevents extreme forces, stable simulation

**Tradeoff**: Not physically accurate (but that's okay for art!)

## Learning Opportunities

### For Beginners
1. **Object-Oriented Programming**: Clear example of classes and encapsulation
2. **Vector Mathematics**: Practical application of 2D/3D vectors
3. **Animation Loops**: Understanding game loop pattern
4. **Physics Simulation**: Simple but effective physics implementation

### For Intermediate Developers
1. **Performance Optimization**: O(n²) complexity considerations
2. **Algorithmic Complexity**: When to optimize vs. keep simple
3. **Creative Coding**: Balancing art and code
4. **State Management**: Simple but effective state handling

### For Advanced Developers
1. **Optimization Opportunities**: Spatial partitioning, GPU computation
2. **Architectural Scalability**: When simple patterns break down
3. **API Design**: P5.js as example of creative coding API
4. **Generative Art**: Code as artistic medium

## Recommended Modifications

### High Value, Low Effort
1. Extract magic numbers to configuration object
2. Remove commented-out code or document it
3. Add JSDoc comments for class and methods
4. Replace `for...in` with `for...of` or traditional loops

### Medium Value, Medium Effort
1. Add UI controls (sliders, buttons)
2. Implement pause/play functionality
3. Add preset configurations
4. Create screenshot/export feature

### High Value, High Effort
1. Implement spatial partitioning for better performance
2. Add 3D rendering capabilities
3. Create plugin system for different force types
4. Build configuration GUI with live preview
