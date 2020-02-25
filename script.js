let everyone_has_gravity = false; // if this is true, all objects will influence each other by mass, if false only stationary objects will exert gravitational force.

class CelestialObject {
  constructor(x, y, z, mass, size, stationary, color) {
    this.location = createVector(x,y, z);
    this.heading = 0; // Keep this in Radians
    this.velocity = createVector(0,0);
    this.gravforce = createVector(0,0);
    this.gravModifier = 0.005; // chill it out
    this.mass = mass;
    this.G = 1;
    this.size = size;
    this.stationary = stationary;
    this.previousLocation = this.location.copy();
    this.color = color;
  }
  
  gravity(obj) {
    let dir = obj.location.copy().sub(this.location);
    let r = dir.mag();
    let f = this.G * ((obj.mass * this.mass) / (r * r));
    this.gravforce = dir.copy().mult(f);
    this.gravforce.normalize();
    this.gravforce.mult(this.gravModifier);
    this.velocity.add(this.gravforce);
  }
  
  move() {
    this.previousLocation = this.location.copy();
    this.location.add(this.velocity);
  }
  
  addThrust(t, angle) {
    this.heading = angle;
    let thrustForce = createVector(0,-1);
    thrustForce.rotate(angle);
    thrustForce.normalize();
    this.velocity.add(thrustForce);
  }
    
  update(objs) {
    for (let i=0; i<objs.length; i++) {
      if (!everyone_has_gravity && objs[i] != this && objs[i].stationary && !this.stationary) {
        this.gravity(objs[i]);
      }
      else if (everyone_has_gravity && objs[i] != this) {
        this.gravity(objs[i]);
      }
    }
    if (! this.stationary) {
      this.move();
    }
  }
  
  draw() {
    fill(this.color);
    stroke(this.color);
    if (! this.stationary) {
      strokeWeight(this.velocity.mag() * this.size * 0.5);
      line(this.location.x, this.location.y, this.previousLocation.x, this.previousLocation.y); 
    }
    if (this.stationary) {
      stroke(0);
      //ellipse(this.location.x, this.location.y, this.size, this.size);
    }
    //translate(this.location.x, this.location.y, this.location.z);
    //sphere(this.size * 10);
  }
}

p5.disableFriendlyErrors = true;

let universe = [];

function setup() {
  createCanvas(windowWidth - 40, windowHeight, WEBGL);
  let width = windowWidth -40;
  let height = windowHeight;
  background(0);
  stroke(0);
  fill(0);
  
  let cx = width / 2;
  let cy = height / 2;
  let cz = 0;
  universe.push(new CelestialObject(cx, cy, cz, 50, 5, true, [250, 250 , 250]));
  universe.push(new CelestialObject(cx, cy + 200, cz, 50, 5, true, [250, 250 , 250]));
  universe.push(new CelestialObject(cx, cy - 200, cz, 50, 5, true, [250, 250 , 250]));
  
  universe.push(new CelestialObject(cx + 200, cy, cz, 50, 5, false, [250, 250 , 250]));
  universe.push(new CelestialObject(cx + 200, cy + 200, cz, 50, 5, false, [250, 250 , 250]));
  universe.push(new CelestialObject(cx + 200, cy - 200, cz, 50, 5, false, [250, 250 , 250]));

  universe.push(new CelestialObject(cx - 200, cy, cz, 50, 5, false, [250, 250 , 250]));
  universe.push(new CelestialObject(cx - 200, cy + 200, cz, 50, 5, false, [250, 250 , 250]));
  universe.push(new CelestialObject(cx - 200, cy - 200, cz, 50, 5, false, [250, 250 , 250]));

  
  let grid_spacing = 5
  let space_between = width / grid_spacing;
  for (let i=0; i<=grid_spacing; i++) { // grid_spacing + 1 columns
    let y = i * space_between;
    let z = 0;
    for (let j=0; j<=grid_spacing; j++) {
      let x = j * space_between; // grid_spacing + 1 rows
      let r = 200;
      let g = 200;
      let b = 200;
      let s = new CelestialObject(x, y, z, 0.1, 0.1, false, [r,g,b]);
      universe.push(s);
    }
    // let s = new CelestialObject(x, y, z, 0.1, 0.1, false, [r,g,b]);
    // let heading = random(0, PI * 2);
    // s.addThrust(0.1, heading);
  }
}

function draw() {
  //clear();
  translate(-width/2,-height/2,0);
  //let fov = PI/3;
  //let cameraZ = (height/2.0) / tan(fov/2.0);
  //perspective(fov, width/height, cameraZ/10.0, cameraZ*10.0);
  for (const i in universe) {
    universe[i].update(universe);
    universe[i].draw();
  }
  //box();
  //translate(100,100,-100);
  //box();
}
