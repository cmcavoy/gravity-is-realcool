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
      //if (objs[i] != this && objs[i].stationary && !this.stationary) {
      if (objs[i] != this) {
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
    strokeWeight(this.velocity.mag());
    line(this.location.x, this.location.y, this.previousLocation.x, this.previousLocation.y); 
    //ellipse(this.location.x, this.location.y, this.size, this.size);
    //translate(this.location.x, this.location.y, this.location.z);
    //sphere(this.size * 10);
  }
}

p5.disableFriendlyErrors = true;

let planets = 1;
let ships = 10;

let universe = [];

function setup() {
  createCanvas(windowWidth - 40, windowHeight, WEBGL);
  let width = windowWidth -40;
  let height = windowHeight;
  background(255);
  stroke(0);
  fill(0);
  
  for (let i=0; i<planets; i++) {
    //let x = int(random(0,width));
    //let y = int(random(0,height));
    let x = width / 2;
    let y = height / 2;
    let z = 0;
    let p = new CelestialObject(x, y, z, 50, 10, true, [255, 0 , 0]);
    universe.push(p);
  }
  
  for (let i=0; i<ships; i++) {
    let x = int(random(0,width));
    let y = int(random(0,height));
    let z = int(random(0,50));
    let r = random(0,255);
    let g = random(0,255);
    let b = random(0,255);

    let s = new CelestialObject(x, y, z, 0.1, 10, false, [r,g,b]);
    let heading = random(0, PI * 2);
    s.addThrust(0.1, heading);
    universe.push(s);
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
