gobbler = new Object();
gobbler.stageHeight = 1920;
gobbler.stageWidth = 1080;

gobbler.board_state = [[0, 1, 0, 0], [-1, 0, 1, 0], [-1, 0, 0, 0], [1, 0, -1, -1]];

gobbler.pieces = [[],[]];
gobbler.RED = 1;
gobbler.BLACK = -1;
gobbler.NUMPIECES = 16;


gobbler.init = function () {

    for (i=0; i < this.NUMPIECES; i++) {
        this.pieces[0][i] = new Piece("red");
        this.pieces[1][i] = new Piece("black");
    }
    console.log(gobbler.board_state);
    this.draw();

};


gobbler.draw = function () {
    gobbler.resetPieces();
   
    var red_index = 0;
    var black_index = 0;
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (this.board_state[x][y] != 0) {
                var p = this.board_state[x][y] > 0 ? this.pieces[0][red_index++] : this.pieces[1][black_index++];
                this.movePiece(p, x, y);
               
            }
        }
    }
    stage.update();
}

gobbler.movePiece = function (piece, x, y) {
    piece.x = x; piece.y = y;
    piece.shape.x = board.x + (x + .5) * board.space_width;
    piece.shape.y = board.y + (y + .5) * board.space_height;
}

gobbler.resetPieces = function () {
    var radius = this.pieces[0][0].radius;
    for (i = 0; i < this.NUMPIECES; i++) {   
        this.pieces[1][i].shape.x = 75 + i * radius * 2;
        this.pieces[1][i].shape.y = 75;
        this.pieces[0][i].shape.x = 75 + i * radius * 2;
        this.pieces[0][i].shape.y = gobbler.stageHeight - 75;
        this.pieces[0][i].x = -1; this.pieces[0][i].y = -1;
        this.pieces[1][i].x = -1; this.pieces[1][i].y = -1;
    }

}

/*
* for now the score is just based on who won!
* 1 is red wins, -1 is black wins
*/
gobbler.score = function () {
    //check columns
    var state = this.board_state;
    for (var x = 0; x < 4; x++) {
        if (state[x].reduce(function (a, b) { return a + b; }) == 4) { return 1; }
        if (state[x].reduce(function (a, b) { return a + b; }) == -4) { return -1; }
    }
    // rotate and check again
    var state = this.roate2DArray(state);
    for (var x = 0; x < 4; x++) {
        if (state[x].reduce(function (a, b) { return a + b; }) == 4) { return 1; }
        if (state[x].reduce(function (a, b) { return a + b; }) == -4) { return -1; }
    }

    // check diagonals
    var sum = state[0][0] + state[1][1] + state[2][2] + state[3][3];
    if (sum == 4) { return 1;}
    if (sum == -4) { return -1; }

    // other diagonal
    var sum = state[3][0] + state[2][1] + state[1][2] + state[0][3];
    if (sum == 4) { return 1; }
    if (sum == -4) { return -1; }

    return 0;
}

gobbler.roate2DArray = function (a) {
    return a.map(function (col, i) {
        return a.map(function (row) {
            return row[i]
        })
    });
    

}


console.log("setting timeout");

setTimeout(scramble, 3000);

function scramble () {
    console.log("scramble");
    //randomize the board layout
    for (x = 0; x < 4; x++) {
        for (y = 0; y < 4; y++) {
            if (Math.random() > .5) {
                gobbler.board_state[x][y] = 1;
            } else {
                gobbler.board_state[x][y] = -1;
            }
        }
    }
    gobbler.draw();
    var score = gobbler.score();
    if (score != 0) {
        var color = score > 0 ? "red" : "black";
        alert("The winner is " + color);
    } else {
        setTimeout(scramble, 3000);
    }
}


gobbler.init();