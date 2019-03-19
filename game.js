// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  Game.setBoard(0,new TitleScreen("Welcome to Frogger","Press space to start de game",
                                  playGame));
}

var playGame = function() {
  var board = new GameBoard(Game.ctx);
  board.init();
  Game.setBoard(3,board);
}

var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", "Press space to restart",
                          playGame));
};



var loseGame = function () {
  Game.setBoard(3, new TitleScreen("You lose!","Press space to restart de game",
    playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
