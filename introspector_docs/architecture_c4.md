# C4 Architecture Diagrams

This document provides C4 model architectural diagrams for the "Gravity Is Real Cool" project using Mermaid syntax.

## Context Diagram

The system context shows how the application fits into its environment and interacts with users.

```mermaid
graph TB
    User[User<br/>Creative coder, educator,<br/>or digital artist]
    System[Gravity Is Real Cool<br/>Physics-based generative<br/>art application]
    CDN[jsdelivr CDN<br/>P5.js library hosting]
    Browser[Web Browser<br/>Chrome, Firefox, Safari, Edge]

    User -->|Views and interacts with| Browser
    Browser -->|Runs| System
    System -->|Loads P5.js library from| CDN
    Browser -->|Renders WebGL graphics| User

    style System fill:#1168bd,stroke:#0b4884,color:#ffffff
    style User fill:#08427b,stroke:#052e56,color:#ffffff
    style CDN fill:#999999,stroke:#6b6b6b,color:#ffffff
    style Browser fill:#999999,stroke:#6b6b6b,color:#ffffff
```

**Key Relationships**:
- **User → Browser**: User opens the application in their web browser
- **Browser → System**: Browser loads and executes the JavaScript application
- **System → CDN**: Application fetches P5.js library (v0.10.2) from jsdelivr CDN
- **Browser → User**: Browser renders the visual output using WebGL

## Container Diagram

The container diagram shows the high-level technical building blocks of the application.

```mermaid
graph TB
    subgraph Browser["Web Browser (Container)"]
        HTML[index.html<br/>Single Page Application<br/>HTML5]
        CSS[style.css<br/>Visual Styling<br/>CSS3]
        JS[script.js<br/>Physics Engine & Renderer<br/>JavaScript ES6]
        Canvas[Canvas Element<br/>WebGL Rendering Context<br/>P5.js]
    end

    P5JS[P5.js Library v0.10.2<br/>Creative Coding Framework<br/>JavaScript]
    CDN[jsdelivr CDN<br/>Static Asset Hosting]

    HTML -->|Loads and styles| CSS
    HTML -->|Loads with defer| JS
    HTML -->|References| P5JS
    JS -->|Uses API| P5JS
    JS -->|Draws on| Canvas
    P5JS -->|Creates and manages| Canvas
    P5JS -->|Loaded from| CDN

    style Browser fill:#dddddd,stroke:#9a9a9a
    style HTML fill:#1168bd,stroke:#0b4884,color:#ffffff
    style CSS fill:#1168bd,stroke:#0b4884,color:#ffffff
    style JS fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Canvas fill:#1168bd,stroke:#0b4884,color:#ffffff
    style P5JS fill:#999999,stroke:#6b6b6b,color:#ffffff
    style CDN fill:#999999,stroke:#6b6b6b,color:#ffffff
```

**Containers**:

1. **index.html** (HTML Document)
   - Technology: HTML5
   - Responsibility: Application entry point, loads dependencies
   - Loads: P5.js from CDN, local script.js, style.css

2. **style.css** (Stylesheet)
   - Technology: CSS3
   - Responsibility: Visual styling (minimal - black background)
   - Size: 11 lines

3. **script.js** (JavaScript Application)
   - Technology: JavaScript ES6
   - Responsibility: Physics engine, simulation logic, rendering
   - Size: 132 lines
   - Contains: CelestialObject class, setup(), draw(), universe state

4. **Canvas Element** (Rendering Surface)
   - Technology: WebGL via P5.js
   - Responsibility: Hardware-accelerated graphics rendering
   - Created by: P5.js createCanvas() with WEBGL mode

5. **P5.js Library** (External Dependency)
   - Technology: JavaScript library v0.10.2
   - Responsibility: Canvas abstraction, vector math, animation loop
   - Source: jsdelivr CDN

## Component Diagram

The component diagram shows the internal structure of script.js, the main application logic.

```mermaid
graph TB
    subgraph ScriptJS["script.js (JavaScript Application)"]
        subgraph DataStructures["Data Structures"]
            Universe[universe<br/>Array of CelestialObject<br/>Application state]
            Config[Configuration<br/>everyone_has_gravity flag<br/>Global settings]
        end

        subgraph Classes["Classes"]
            CelestialObject[CelestialObject Class<br/>Physics entity<br/>Properties & behavior]
        end

        subgraph Lifecycle["P5.js Lifecycle"]
            Setup[setup Function<br/>Initialization<br/>Canvas & object creation]
            Draw[draw Function<br/>Animation loop<br/>Update & render]
        end

        subgraph Methods["CelestialObject Methods"]
            Gravity[gravity method<br/>Force calculation<br/>F = G × m1m2/r²]
            Move[move method<br/>Position update<br/>location += velocity]
            Update[update method<br/>Main loop<br/>Apply forces]
            DrawMethod[draw method<br/>Visual rendering<br/>Trail drawing]
        end
    end

    subgraph P5["P5.js API"]
        Vector[p5.Vector<br/>Vector math utilities]
        DrawingAPI[Drawing Functions<br/>line, stroke, fill, etc.]
        CanvasAPI[Canvas Functions<br/>createCanvas, translate]
    end

    Setup -->|Creates and populates| Universe
    Setup -->|Instantiates| CelestialObject
    Setup -->|Uses| CanvasAPI

    Draw -->|Iterates over| Universe
    Draw -->|Calls| Update
    Draw -->|Calls| DrawMethod
    Draw -->|Uses| DrawingAPI

    Update -->|Reads| Universe
    Update -->|Calls| Gravity
    Update -->|Calls| Move
    Update -->|Checks| Config

    Gravity -->|Uses| Vector
    Gravity -->|Modifies| CelestialObject

    Move -->|Uses| Vector
    Move -->|Updates| CelestialObject

    DrawMethod -->|Uses| DrawingAPI
    DrawMethod -->|Reads| CelestialObject

    CelestialObject -->|Contains| Gravity
    CelestialObject -->|Contains| Move
    CelestialObject -->|Contains| Update
    CelestialObject -->|Contains| DrawMethod

    style ScriptJS fill:#dddddd,stroke:#9a9a9a
    style DataStructures fill:#c4d8eb,stroke:#8bb1d6
    style Classes fill:#c4d8eb,stroke:#8bb1d6
    style Lifecycle fill:#c4d8eb,stroke:#8bb1d6
    style Methods fill:#e8f0f7,stroke:#b3d1e8
    style P5 fill:#f0f0f0,stroke:#c0c0c0
    style Universe fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Config fill:#1168bd,stroke:#0b4884,color:#ffffff
    style CelestialObject fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Setup fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Draw fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Gravity fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Move fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Update fill:#1168bd,stroke:#0b4884,color:#ffffff
    style DrawMethod fill:#1168bd,stroke:#0b4884,color:#ffffff
```

**Component Details**:

### Data Structures
- **universe**: Global array storing all CelestialObject instances (both stationary wells and moving particles)
- **everyone_has_gravity**: Configuration flag determining gravity behavior

### Classes
- **CelestialObject**: Encapsulates physics entity with properties (location, velocity, mass) and methods (gravity, move, update, draw)

### P5.js Lifecycle Hooks
- **setup()**: Called once at initialization, creates canvas and populates universe
- **draw()**: Called ~60 times per second, updates physics and renders

### CelestialObject Methods
- **gravity(obj)**: Calculates gravitational force from another object using inverse square law
- **move()**: Updates position based on accumulated velocity
- **update(objs)**: Main update loop applying forces from all relevant objects
- **draw()**: Renders visual representation (trails for moving objects)

## Data Flow Diagram

This diagram shows how data flows through the system during the animation loop.

```mermaid
graph TB
    Start([Draw Loop Starts<br/>~60 FPS])

    Start --> Translate[Translate Coordinate System<br/>Adjust for WEBGL]

    Translate --> LoopStart{For Each Object<br/>in Universe}

    LoopStart -->|Next Object| UpdatePhase[Update Phase<br/>Object.update universe]

    UpdatePhase --> GravityLoop{For Each Other<br/>Object}

    GravityLoop -->|Check Rules| GravityRules{Apply Gravity?<br/>Based on stationary<br/>& config}

    GravityRules -->|Yes| CalcForce[Calculate Force<br/>F = G × m1m2/r²]
    GravityRules -->|No| GravityLoop

    CalcForce --> AddVelocity[Add to Velocity<br/>velocity += force]
    AddVelocity --> GravityLoop

    GravityLoop -->|All Processed| CheckStationary{Is Stationary?}

    CheckStationary -->|No| MoveObject[Update Position<br/>location += velocity<br/>Store previous location]
    CheckStationary -->|Yes| DrawPhase

    MoveObject --> DrawPhase[Draw Phase<br/>Object.draw]

    DrawPhase --> RenderTrail[Render Trail<br/>Line from previous<br/>to current position<br/>Weight = velocity magnitude]

    RenderTrail --> LoopStart

    LoopStart -->|All Done| End([Frame Complete<br/>Wait for next frame])

    End --> Start

    style Start fill:#4caf50,stroke:#388e3c,color:#ffffff
    style End fill:#4caf50,stroke:#388e3c,color:#ffffff
    style UpdatePhase fill:#2196f3,stroke:#1976d2,color:#ffffff
    style DrawPhase fill:#ff9800,stroke:#f57c00,color:#ffffff
    style CalcForce fill:#9c27b0,stroke:#7b1fa2,color:#ffffff
    style MoveObject fill:#00bcd4,stroke:#0097a7,color:#ffffff
    style RenderTrail fill:#ff5722,stroke:#e64a19,color:#ffffff
```

**Flow Description**:

1. **Frame Start**: P5.js calls draw() at approximately 60 FPS
2. **Coordinate Adjustment**: Translate coordinate system for WEBGL mode
3. **Object Loop**: Iterate through all objects in universe array
4. **Physics Update**: For each object, calculate gravitational forces from other objects
5. **Force Calculation**: Apply inverse square law for qualifying object pairs
6. **Velocity Update**: Accumulate forces into velocity vector
7. **Position Update**: Move non-stationary objects based on velocity
8. **Rendering**: Draw line from previous to current position with velocity-based weight
9. **Repeat**: Continue to next object until all processed
10. **Frame Complete**: Wait for next frame, repeat infinitely

## Deployment Diagram

Shows how the application is deployed and accessed by users.

```mermaid
graph TB
    subgraph UserDevice["User's Device"]
        subgraph Browser["Web Browser"]
            Runtime[JavaScript Runtime<br/>V8/SpiderMonkey/JavaScriptCore]
            WebGLContext[WebGL Context<br/>GPU-accelerated rendering]

            subgraph AppFiles["Application Files (Cached)"]
                HTMLFile[index.html]
                CSSFile[style.css]
                JSFile[script.js]
            end
        end
    end

    subgraph Internet["Internet"]
        CDNServer[jsdelivr CDN<br/>Content Delivery Network]
        WebServer[Web Server<br/>Static file hosting<br/>Glitch/GitHub Pages/etc.]
    end

    WebServer -->|Serves| HTMLFile
    WebServer -->|Serves| CSSFile
    WebServer -->|Serves| JSFile

    CDNServer -->|Serves| P5JSLib[P5.js v0.10.2<br/>JavaScript Library]

    P5JSLib -->|Loaded into| Runtime
    JSFile -->|Executed by| Runtime
    Runtime -->|Uses| WebGLContext

    style UserDevice fill:#e8f5e9,stroke:#4caf50
    style Browser fill:#fff8e1,stroke:#ffc107
    style Internet fill:#e3f2fd,stroke:#2196f3
    style Runtime fill:#1168bd,stroke:#0b4884,color:#ffffff
    style WebGLContext fill:#1168bd,stroke:#0b4884,color:#ffffff
```

**Deployment Notes**:

- **Static Hosting**: Application can be hosted on any static file server (GitHub Pages, Netlify, Glitch, etc.)
- **No Build Step**: Files served as-is, no compilation or bundling required
- **CDN Dependency**: Relies on jsdelivr CDN for P5.js library
- **Client-Side Only**: All processing happens in user's browser
- **GPU Acceleration**: WebGL provides hardware-accelerated rendering
- **Cross-Platform**: Works on any device with modern browser and WebGL support
