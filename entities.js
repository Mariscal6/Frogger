var sprites = {
  escenario:{sx:422,sy:0,w:550,h:625,frame:1},
  agua:{sx:422,sy:49,w:550,h:240,frame:1},
  meta:{sx:422,sy:49,w:550,h:48,frame:1},
  froggerLogo:{sx:0,sy:392,w:272,h:167,frame:1},
  car:{sx:0,sy:0,w:103,h:48,frame:3},
  small_truck:{sx:0,sy:60,w:138,h:44,frame:1},
  big_truck:{sx:145,sy:57,w:208,h:46,frame:1},
  tronco_med:{sx:4,sy:120,w:199,h:46,frame:1},
  tronco_grande:{sx:9,sy:172,w:247,h:46,frame:1},
  tronco_peq:{sx:269,sy:168,w:138,h:46,frame:1},
  skull:{sx:211,sy:123,w:47,h:44,frame:4},
  turtle:{sx:5,sy:289,w:49,h:45,frame:9},
  frog:{sx:0,sy:340,w:39.28,h:46,frame:9},
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


/// CLASE PADRE SPRITE
var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
}


///////////////////////////////////////FONDO RANA

var fondo = function(){
this.setup('escenario', { frame: 0 });
this.x = 0;
this.y = 0;
};

fondo.prototype = new Sprite();

fondo.prototype.step = function(dt) {
};
///////////////////////////////////////Agua

var Water = function () {
  this.setup('agua', {
    frame: 0
  });
  this.x = 0;
  this.y = 49;
};

Water.prototype = new Sprite();
Water.prototype.type=OBJECT_ENEMY;
Water.prototype.step = function (dt) {
  var collision = this.board.collide(this, OBJECT_PLAYER);
  if(collision){
    if(!collision.moving()){
      //this.board.remove(collision);
      collision.hit(this.damage);
    }
  }
  
};
Water.prototype.draw = function () {
  
}
//////////////////////////////////////Agua

var Meta = function () {
  this.setup('meta', {
    frame: 0
  });
  this.x=0;
  this.y=0;
};

Meta.prototype = new Sprite();
Meta.prototype.type=OBJECT_ENEMY;
Meta.prototype.step = function (dt) {
  var collision = this.board.collide(this, OBJECT_PLAYER);
  if(collision){
    winGame();
    this.board.activate=false;
  }
  
};
Meta.prototype.draw = function () {
  
}
///////////////////////////////////////// Death

var Death = function(centerX,centerY) {
  this.setup('skull', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
  this.subFrame = 0;
};

Death.prototype = new Sprite();

Death.prototype.step = function(dt) {
  this.frame = Math.floor(this.subFrame++ / 16);
  if(this.subFrame >= 48) {
    this.board.remove(this);
  }
};
  
/////////////////////////////////////////FROG

var Frog = function () {
  this.setup('frog', {
    frame: 0,
    vx: 0
  });
  this.x = Game.width / 2 - this.w / 2;
  this.y = Game.height - this.h / 2;
  this.subFrame = 0;
  this.mover = false;
};
Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function (dt) {
  this.x += (this.vx * dt);
  if (this.mover) {
    this.animacion();
  } else {
    if (Game.keys['left']) {
      this.x -= this.w;
    } else if (Game.keys['right']) {
      this.x += this.w;
    } else if (Game.keys['up']) {
      this.mover=true;
    } else if (Game.keys['down']) {
      this.moverRanaAbajo();
    }
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > Game.width - this.w) {
      this.x = Game.width - this.w;
    }
    if (this.y - this.h < 0) {
      this.y = 0;
    } else if (this.y > Game.height - this.h) {
      this.y = Game.height - this.h;
    }
    Game.keys = {};
  }
  this.vx = 0;
}
Frog.prototype.onTrunk = function (vt) {
  this.vx = vt;
}
Frog.prototype.moving = function () {
  if (this.vx != 0) {
    return true;
  }
  return false;
}
Frog.prototype.animacion=function(){
  if (this.frame != Math.floor(this.subFrame / 5)) {
    this.y -= 48 / 7;
    console.log(this.y);
}
this.frame = Math.floor(this.subFrame++ / 5);
if (this.subFrame > 35) {
  this.y = Math.floor(this.y);
  this.frame = 0;
  this.mover = false;
  this.subFrame=0;
}
}
Frog.prototype.moverRanaArriba = function () {
  this.y -= 48;
}
Frog.prototype.moverRanaAbajo = function () {
  this.y += 48;
}
Frog.prototype.hit = function () {
  this.board.add(new Death(this.x + this.w / 2, this.y + this.h / 2));
  //this.board.remove(this);
  loseGame();
}
//////////////////////////////////////////Car 
/**
 * @param coche {si camnion(small_truck o big_truck), o coche (car)}
 * @param frame {si seleccionas coche (0 azul,1 verde,2 amarillo)}
 * @param vel {velocidad,para que vaya de derecha a izquierda poner velocidad negativa}
 * @param fila {que fila }
 */

var Car = function (coche, frame, vel, fila) {
  this.setup(coche, {
    frame: frame,
    vx: vel,
  });
  this.fila=fila;
  if (vel < 0) {
    this.x = Game.width;
  } else {
    this.x = 0;
  }
  this.y = Game.height - 48 * (this.fila + 1);
};
Car.prototype = new Sprite();
Car.prototype.type = OBJECT_ENEMY;
Car.prototype.step = function (dt) {
  this.x += this.vx * dt;
  if ((this.x > Game.width + this.w) || this.x < -this.w) {
    this.board.remove(this);
  } else {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
      collision.hit(this.damage);
      //this.board.remove(this);

    }
  }

}
//////////////////////////////////////////Trunk
/**
 * @param tronco {tronco_med ,tronco_grande ,tronco_peq}
 * @param vel {velocidad}
 * @param fila {que fila }
 */

var Trunk = function (tronco, f, vel, fila) {
  this.setup(tronco, {
    frame: f,
    vx: vel
  });
  this.fila=fila;
  if (vel < 0) {
    this.x = Game.width;
  } else {
    this.x = 0;
  }
  this.y = Game.height - 48 * (this.fila + 7);
};
Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_ENEMY;
Trunk.prototype.step = function (dt) {
  this.x += this.vx * dt;
  if ((this.x > Game.width + this.w) || this.x < -this.w) {
    this.board.remove(this);
  } else {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
      collision.onTrunk(this.vx);
    }
  }
}

//////////////////////////////////////////Tortuga
/**
 * @param tronco {tronco_med ,tronco_grande ,tronco_peq}
 * @param vel {velocidad}
 * @param fila {que fila }
 */

var Turtle = function (vel, fila) {
  this.setup("turtle", {
    frame: 0,
    vx: vel
  });
  this.fila=fila;
  if (vel < 0) {
    this.x = Game.width;
  } else {
    this.x = 0;
  }
  this.y = Game.height - 48 * (this.fila + 7);
};
Turtle.prototype = new Sprite();
Turtle.prototype.type = OBJECT_ENEMY;
Turtle.prototype.step = function (dt) {
  this.x += this.vx * dt;
  if ((this.x > Game.width + this.w) || this.x < -this.w) {
    this.board.remove(this);
  } else {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
      collision.onTrunk(this.vx);
    }
  }
}
var niveles = [
  [10, 2000, 'big_truck', 3,'coche'],
  [5, 5000, 'small_truck', 1,'coche'],
];
var Spawner = function () {
  this.t = 0;
  var tortuga=new Turtle(200,0);
  var coche=new Car('small_truck',0,200,0);
  var tronco=new Trunk('tronco_grande',0,200,3);
  this.objects={'tortuga': tortuga,'coche':coche,'tronco':tronco};
}
Spawner.prototype = new Sprite();
Spawner.prototype.step = function (dt) {
  this.t += dt;
  // por cada fila
  for (f in niveles) {
    var nivel=niveles[f];
    if (this.t > nivel[0]) {
      niveles[f][0] += nivel[1];
      var aux=Object.create(this.objects[nivel[4]]);
      aux.sprite=f[2];
      aux.fila=f[3];
      this.board.addFront(aux);
    }
  }

}
Spawner.prototype.draw = function () {
  
}