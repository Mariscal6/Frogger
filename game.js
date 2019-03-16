// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleScreen("Press space to start playing",
                                  playGame));
}

var playGame = function() {
  var board = new GameBoard(Game.ctx);
  board.add( new fondo());
  board.add(new Frog());
  board.add(new Spawner());
  Game.setBoard(3,board);
  /*
  board.add(new Car("car",1,100,5));
  board.add(new Car("small_truck",0,-100,3));
  board.add(new Trunk("tronco_grande",0,30,2));
  board.add(new Turtle(30,1));
  board.add(new Trunk("tronco_grande",0,30,3));
  board.add(new Trunk("tronco_grande",0,30,4));
  board.add(new Trunk("tronco_grande",0,30,5));
  board.add(new Meta());
  board.add(new Water());
  
  Game.setBoard(3,board);*/

  //board.add()
 // board.add(new PlayerShip());
  //board.add(new Level(level1,winGame));
  //Game.setBoard(3,board);
}

var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", 
                          playGame));
};



var loseGame = function () {
  Game.setBoard(3, new TitleScreen("You lose!",
    playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
