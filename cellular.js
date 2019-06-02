selectMode = "blobs"
selectedBlob = 0;
width = 400
height = 400
nbr_rows = 20
nbr_columns = 20
Blobs= [];
nbr_plantspots = 10;
regrow_time = 500;
play= true;
id= 0;
var selection; 

function setup() {
  createCanvas(800, 800);
  canvas = document.getElementById('defaultCanvas0')

  document.getElementById('viz').appendChild(canvas)


  Terrain = new Terrain()
  Terrain.generate();
  Pop = new Population()
  Pop.generatePop(10)
  printGlobals();
}

function draw() {

  if (play == true) {
    background(220);
    show_pad();
    Mouse_check();

    fill(250,0,0)
    ellipse(300,300,20);

    for(b=0; b < Pop.Blobs.length; b++) {
    blob = Pop.Blobs[b];
    if(blob.alive == false) {Pop.Blobs.splice(b,1)}
    blob.perceive();
    blob.think();
    blob.act();
    blob.targeting();
    blob.move();
    blob.show();
    blob.check_death();
    if(frameCount % 40 == 0) {blob.life = blob.life - 0.1}
    if(frameCount % 1000 == 0 && blob.age() > 1000) {blob.reproduce()}
    }

    Terrain.reassess();
    if(frameCount % regrow_time == 0) {Terrain.grow_plants();}

    fill(250,250,250)
    rect(3,3, 100,40)
    fill(0,0,0)
    textSize(20)
    text(frameCount,20,30)
  }
}


function Terrain() {
  this.Pads = []

  this.generate = function() {
    for (i=0; i < nbr_rows;i++) {
      row = []
      for(p=0; p < nbr_columns; p++) {
        row[p] = new Pad(
          p*width/nbr_columns,
          i*height/nbr_rows,
          [255,255,200],
          "food"
          )
      }
    this.Pads[i] = row
    }
    
    for (ia=0; ia < nbr_rows; ia++) {
      for(pa=0; pa < nbr_columns; pa++) {
        pad = this.Pads[ia][pa];
        pad.neighbors = pad.neighbors_calc(1);
      }
    }

    this.plant_generation();
  }

  this.plant_generation = function() {
    // Randomly chooses Plant Spawn // 
   for (i=0; i<nbr_plantspots; i++) {
      pad = random(random(this.Pads))
      pad.food = 255
      console.log(pad)
    }
  

    // GROW PLANTS  // 
    this.grow_plants();
  }

  this.grow_plants = function() {
    for (i=0; i < nbr_rows;i++) {
      for(p=0; p < nbr_columns; p++) {
        grow_chance = 0;
        pad = this.Pads[i][p]
        for(m=0; m < pad.neighbors.length; m++) {
          grow_chance += pad.neighbors[m].food;
        }
        pad.grow_chance = grow_chance/pad.neighbors.length
      }
    }

    for (i=0; i < nbr_rows;i++) {
      for(p=0; p < nbr_columns; p++) {
        pad = this.Pads[i][p]
        pad.food = pad.food + pad.grow_chance*(0.2  + random(0.7))
        if(pad.food>250) {pad.food = 250}
      }
    }
  }

  this.reassess = function() {
    for (i=0; i < nbr_rows;i++) {
      for(p=0; p < nbr_columns; p++) {
        this.Pads[i][p].reassess();
        this.Pads[i][p].blobs_inside();
      }
    }

  }

}

function Pad (x, y, clor, mat) {
  this.x = x
  this.y = y
  this.mat = random(250)
  this.food = 0 //random(0,250)
  this.clor = clor
  this.size = width/nbr_rows
  this.neighbors = [];
  this.blobs_in = [];
  this.coord= createVector(this.y*nbr_columns/width, this.x*nbr_rows/width)

  this.reassess = function() {
    this.clor[0] = 255 - this.food
    this.clor[2] = 200 - this.food
  }

  this.neighbors_calc = function(n) {
    neighbors = []
    for(i= -n; i < n + 1; i++ ) {
      for(p= -n; p < n + 1; p++ ) {
        posx= this.x*nbr_rows/width;
        posy= this.y*nbr_columns/height ;
        if(Terrain.Pads[posy -i]) {pad = Terrain.Pads[posy -i][posx - p];}
        if(pad) {
          if(pad.x != this.x || this.y != pad.y) {neighbors.push(pad);}
        }

      }
      
    }
    return neighbors
  }

  this.neighbors_show = function() {
    for(i=0; i < this.neighbors.length; i++) {
      this.neighbors[i].clor = [0,0,0];
      console.log("done")
    }
  }

  this.blobs_inside = function() {
    Blobs_in = []
    for(ip=0; ip < Pop.Blobs.length; ip++) {
      var blob = Pop.Blobs[ip]
      if (check_in(blob.pos.x, blob.pos.y, this.coord.x, this.coord.y)) 
        { Blobs_in.push(Pop.Blobs[ip]) }
    }
    this.blobs_in = Blobs_in 
    return Blobs_in
  }
}

function DNA (genes) {
  this.Maxlife =  Math.floor(random(20))
  this.radius = 20 + random(10)
  this.clor = [random(255),random(255),random(255)];
  this.speed = random(3)
  //this.regime = "predator"
}

function Blob(x, y, genes, life) {
      if(genes) {this.DNA = genes}
      else {this.DNA = new DNA()}

      // General and Geographic Variables // 
      this.id = id;
      id++;
      this.type = "Blob";
      this.dateOfBirth = frameCount;

      this.pos = createVector(x,y);
      this.vel = p5.Vector.random2D();
      this.vel.setMag(1);
      this.acc = createVector();

      // Visual
      this.clor = this.DNA.clor;
      this.stroke = 1;
      this.radius = this.DNA.radius;

      this.speed = this.DNA.speed;
      this.Maxlife = this.DNA.Maxlife;
      this.alive = true;

      this.life = this.Maxlife;
      if(life) {this.life = life}
      this.regime = this.DNA.regime
      this.others = [];

      this.target_mode = "random_walk";
      this.target = 0;


      this.update = function() {
        //this.life = this.life - 1
      }

      this.act = function() {
        if (this.place.food > 0 && this.life < this.Maxlife) {
          this.eatGrass();
          this.target_mode = "eating"
        }
        else if(this.target) {this.target_mode = "target"}
        else {this.target_mode = "random_walk"}
      }

      this.perceive = function() {
        this.place = check_in2(this.pos.x,this.pos.y);
        this.neighborPads = this.place.neighbors;
        this.neighborPads.push(this.place);
        this.perceive_others();
      }

      this.perceive_others = function() {
        this.others = [];
        this.clor= this.DNA.clor;
        for(m=0; m < this.neighborPads.length; m++) {
            var pado = this.neighborPads[m]
            for(u=0; u < pado.blobs_in.length; u++) {
              var candidate = pado.blobs_in[u];
              if(!this.others.includes(candidate) && candidate != this) 
                {this.others.push(candidate)}
            }
        }
        if(this.others.length > 0) { this.clor=[250, 200, 200] }
      }

      // Decision Making Program // 
      this.think = function() {
        if (this.place.food > 0 && this.life < this.Maxlife) {
          this.eatGrass();
          this.target_mode = "eating"
        }
        else if(this.regime == "predator") { this.hunt() }
        else {this.target_mode = "random_walk"}
      }

      this.hunt = function () {
        if(this.others.length > 0 && this.target !=  0) {
        this.target = random(this.others)
        }
      }

      this.eatGrass = function() {
        if (this.place.food < 10) {this.place.food = 0}
        else {this.place.food -= 10}
        this.life = this.life + 0.1
      }

      this.targeting = function() {
        if(this.target_mode == "random_walk") {this.random_walk()}
        if(this.target_mode == "eating") {this.vel.mult(0)}
        //if(this.target =! 0) {this.headToward(this.target)}
      }

      this.random_walk = function() {
        //if(frameCount%100 == 0) {
          var newvector = p5.Vector.random2D();
          this.vel.x = (this.vel.x * 3 + newvector.x )/4
          this.vel.y = (this.vel.y * 3 + newvector.y)/4
          this.vel.setMag(this.speed);
        //}
      }
      
      this.move = function () {
        //this.vel.add(this.acc);
        this.pos.add(this.vel);
        
        if (this.pos.x > width - 20 || this.pos.y > height - 20 || this.pos.y < 20 || this.pos.x < 20) {
          this.vel.mult(-1)
        }
      }

      this.show = function() {
        fill(this.clor);
        strokeWeight(this.stroke);
        ellipse(this.pos.x, this.pos.y, this.radius);
        //text(Math.floor(this.life), this.pos.x, this.pos.y - this.radius)
        text(Math.floor(this.life), this.pos.x, this.pos.y - this.radius);
      }


      
       this.check_death = function () {
          //var g = map(this.life, 0, this.Maxlife, 0, 200 )
          //var b = map(this.life, 0, 10, 0, 100)
          if(this.life < this.Maxlife/5) {this.clor=[200, 0, 0]}
          if (this.life < 0) {
            this.alive = false
            this.clor = [200,0,0]
          }
        }

      this.reproduce = function() {
        Pop.Blobs.push(new Blob(this.pos.x, this.pos.y, this.DNA, this.life/2))
        this.life = this.life/2
        printGlobals();
      }

      this.headToward = function(obj,x,y) {
      //var dist = sqrt(sq((target.x - this.x)) + sq(target.y - this.y))
      var dx = obj.x - this.pos.x 
      var dy = obj.y - this.pos.y 
      var  angle = atan2(dy, dx)
      this.vel.x = this.speed * cos(angle)
      this.vel.y = this.speed * sin(angle)
      }

      this.age = function() {
        var age = frameCount - this.dateOfBirth 
        return age
      }
          
}

function check_in (x, y, im, jn) {
  pad = Terrain.Pads[im][jn];
  x2 = pad.x + pad.size
  y2 = pad.y + pad.size
  if(pad.x < x && x < x2 && pad.y < y && y < y2) {
      return true
      pad.clor = [250,0,0]
  }

}


function Population() {
  this.Blobs = [];
  this.matingpool = [];


  this.generatePop = function(nbr) {
    console.log(this.Blobs)
    this.Blobs = [];
    for( var i = 0; i < 10; i++) {
    this.Blobs[i] = new Blob(50 + random(width-100), 50 + random(height-100));
  } 
  }

  this.evaluate = function() {

    // Calculating Maximum Fitness // 
    var maxfit = 0
    for(var i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > maxfit) {// should use this algorithm to sort
        maxfit = this.rockets[i].fitness;
      }                   //   the offers in the market
    }

    // Mapping fitness to max // 
    for(var i= 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit;
    }

    // filling the mating pool // 
    this.matingpool = [];
    for(var i= 0; i < this.popsize; i++) {
      var n = this.rockets[i].fitness * 100;
      for(var j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
  }

  this.selection = function() {
    var newRockets = [];
    for (var i = 0; i < this.rockets.length; i++) {
    var parentA = random(this.matingpool).dna;
    var parentB = random(this.matingpool).dna;
    var child = parentA.crossover(parentB);
    newRockets[i]= new Rocket(child);
    }
    this.rockets = newRockets;
  }

  this.run = function() {
    for(var i= 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }

  }


}



function check_in2 (x, y) {
  // takes in coordinates, and return the pad they're in
  for(i=0; i < Terrain.Pads.length; i++) {
    for (j=0; j < Terrain.Pads[i].length; j++) {
      pad = Terrain.Pads[i][j];
      if(check_in(x, y, i, j)) {
        return pad
      }
    }
  }
}

function show_pad() {
  for (i=0; i < nbr_rows; i++) {
    for(p=0; p < nbr_columns; p++) {
      pad = Terrain.Pads[i][p]
      fill(pad.clor)
      rect(pad.x, pad.y, width/nbr_columns, height/nbr_rows)
    }
  }
}