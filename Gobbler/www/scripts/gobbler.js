gobbler = new Object();
gobbler.stageHeight = 1920;
gobbler.stageWidth = 1080;

gobbler.board_state = [[0, 1, 0, 0], [-1, 0, 1, 0], [-1, 0, 0, 0], [1, 0, -1, -1]];
gobbler.win_vectors = [];

gobbler.pieces = [[],[]];
gobbler.RED = 1;
gobbler.BLACK = -1;
gobbler.NUMPIECES = 16;



gobbler.init = function () {
    for (i=0; i < this.NUMPIECES; i++) {
        this.pieces[0][i] = new Piece("red");
        this.pieces[1][i] = new Piece("black");
    }
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
    var score = 0;

    // update our vector of every 4 in a row
    this.updateWinVectors();

    //score each vector
    var score_vector = _.map(gobbler.win_vectors, function (arr) { return _.reduce(arr, gobbler.sum); });

    if (_.contains(score_vector, 4)) { return 1; }  // red wins
    if (_.contains(score_vector, -4)) { return -1; }  // black wins

    // no winners, so guess at who is winning

    // count three in a row's with an empty spot 
    red_three_in_a_rows = (_.filter(score_vector, function (s) { return s == 3; })).length;
    black_three_in_a_rows = (_.filter(score_vector, function (s) { return s == -3; })).length;

    score += .1 * red_three_in_a_rows;
    score += -.1 * black_three_in_a_rows;
    
    // finally, add some jitter so the AI doesn't play the same every time

    score += (Math.random() - .5) * .05;

    console.log("score is " + score);


    return 0;
}

gobbler.sum = function (a, b) { return a + b; }

gobbler.roate2DArray = function (a) {
    return a.map(function (col, i) {
        return a.map(function (row) {
            return row[i]
        })
    });
}

gobbler.updateWinVectors = function () {
    this.win_vectors = [];
    var rotated_state = this.roate2DArray(this.board_state);
    for (i = 0; i < this.board_state.length ; i++) {
        this.win_vectors.push(this.board_state[i]);
        this.win_vectors.push(rotated_state[i]);
    }

    // now diags
    var diag1 = new Array();
    diag1.push(rotated_state[0][0]); diag1.push(rotated_state[1][1]); diag1.push(rotated_state[2][2]); diag1.push(rotated_state[3][3]);
    this.win_vectors.push(diag1);

    var diag2 = new Array();
    diag2.push(rotated_state[3][0]); diag2.push(rotated_state[2][1]); diag2.push(rotated_state[1][2]); diag2.push(rotated_state[0][3]);
    this.win_vectors.push(diag2);

}



setTimeout(scramble, 100);

function scramble () {
    //randomize the board layout
    for (x = 0; x < 4; x++) {
        for (y = 0; y < 4; y++) {
            var r = Math.random();
            if (r < .25) {
                gobbler.board_state[x][y] = 1;
            } else if (r < .5) {
                gobbler.board_state[x][y] = -1;
            } else {
                gobbler.board_state[x][y] = 0;
            }
        }
    }
    gobbler.draw();
    var score = gobbler.score();
    if (score != 0) {
        var color = score > 0 ? "red" : "black";
        alert("The winner is " + color);
    } else {
        setTimeout(scramble, 2000);
    }
}


gobbler.init();