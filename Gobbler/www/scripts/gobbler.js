gobbler = new Object();
gobbler.stageHeight = 1920;
gobbler.stageWidth = 1080;

gobbler.board_state = [[new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()]];
                       
gobbler.win_vectors = [];

gobbler.pieces = [[],[]];
gobbler.RED = 1;
gobbler.RED_MIN = -1;
gobbler.RED_MAX = 1;
gobbler.BLACK = -1;
gobbler.BLACK_MIN = 1;
gobbler.BLACK_MAX = -1;
gobbler.NUMPIECES = 16;

gobbler.current_turn = gobbler.RED;



gobbler.init = function () {
    for (i=0; i < this.NUMPIECES; i++) {
        this.pieces[0][i] = new Piece("red", i % 4 + 1);
        this.pieces[1][i] = new Piece("black", (i % 4 + 1) * -1);
    }
    this.draw();

};


gobbler.draw = function () {
    gobbler.resetPieces();
   
    var red_index = 0;
    var black_index = 0;
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var top_piece = this.board_state[x][y].Peek();
            if (top_piece != null) {
                if (top_piece != null) {
                    var p = top_piece > 0 ? this.pieces[0][red_index++] : this.pieces[1][black_index++];
                    this.movePiece(p, x, y);
                }
               
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

gobbler.takeMove = function (color) {
    var betterScore = function (color, new_score, old_score) { if (color == gobbler.RED) { return new_score > old_score } else { return new_score < old_score } };
    var min_score = color == gobbler.RED ? gobbler.RED_MIN : gobbler.BLACK_MIN;

    var move_list = this.getLegalMoves(color);
    var best_move = new Object(); best_move.score = min_score; best_move.x = -1; best_move.y = -1;

    _.each(move_list, function (move, idx, ctx) {
        // make the move
        gobbler.board_state[move[0]][move[1]].Push(move[2]);
        score = gobbler.score();
        console.log("trying move " + move[0] + " x " + move[1] + " it has score " + score);
        if ( betterScore(color, score, best_move.score)) {
            console.log("new best move of " + move[0] + " x " + move[1] + " with a score of " + score);
            best_move.x = move[0];
            best_move.y = move[1];
            best_move.score = score;
        }
        //undo the move
        gobbler.board_state[move[0]][move[1]].Pop(); // undo the move
    });

    console.log(best_move);

    if (best_move.x == -1) {
        console.log("couldn't find a move!");
    } else {
        gobbler.board_state[best_move.x][best_move.y].Push(color);
        gobbler.draw();
    }

}


gobbler.getLegalMoves = function (color) {
    var move_matrix =
        _.map(this.board_state, function (arr) {
            return _.map(arr, function (spot) {
                return spot.Peek() == null ? true : false
            });
        });

    var move_list = [];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (move_matrix[x][y]) { move_list.push([x, y,color]) };
        }
    }
    return move_list;
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
    

    // count the number of 2's in otherwise empty rows
    red_open_twos = (_.filter(gobbler.win_vectors, function (v) {
        // return true if there are two reds and no blacks
        var reds = (_.filter(v, function (element) { return element == gobbler.RED }).length);
        var blacks = (_.filter(v, function (element) { return element == gobbler.BLACK }).length);
        return (reds==2) && (blacks == 0)
    })).length;
    score += .05 * red_open_twos;
    black_open_twos = (_.filter(gobbler.win_vectors, function (v) {
        // return true if there are two reds and no blacks
        var reds = (_.filter(v, function (element) { return element == gobbler.RED }).length);
        var blacks = (_.filter(v, function (element) { return element == gobbler.BLACK }).length);
        return (reds == 0) && (blacks == 2)
    })).length;
    score -= .05 * black_open_twos;

    // finally, add some jitter so the AI doesn't play the same every time

    score += (Math.random() - .5) * .02;

    console.log("returning score " + score);

    return score;
}

gobbler.sum = function (a, b) { return a + b; }

gobbler.roate2DArray = function (a) {
    return _.map(a,function (col, i) {
        return _.map(a,function (row) {
            return row[i]
        })
    });
}

gobbler.updateWinVectors = function () {
    this.win_vectors = [];

    var simplified_board_state = _.map(gobbler.board_state, function (arr) {
        return _.map(arr, function (spot) {
            return spot.AbsPeek();
        })
    });

    var rotated_state = this.roate2DArray(simplified_board_state);
    for (i = 0; i < simplified_board_state.length ; i++) {
        this.win_vectors.push(simplified_board_state[i]);
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


gobbler.boardClick = function (x, y) {
    if (gobbler.current_turn == gobbler.RED) {
        if (gobbler.board_state[x][y].Peek() == null) {
            gobbler.board_state[x][y].Push(1);
            gobbler.draw();
            gobbler.checkForWinner();
            gobbler.current_turn *= -1;
            setTimeout(function () {
                gobbler.takeMove(gobbler.BLACK);
                gobbler.checkForWinner();
                gobbler.current_turn = gobbler.RED;
            }, 500);
        }
    }

}


function scramble () {
    //randomize the board layout
    for (x = 0; x < 4; x++) {
        for (y = 0; y < 4; y++) {
            var r = Math.random();
            if (r < .25) {
                gobbler.board_state[x][y].Push(1);
            } else if (r < .5) {
                gobbler.board_state[x][y].Push(-1);
            } else {
                gobbler.board_state[x][y] = new Stack();
            }
        }
    }
    gobbler.draw();
    var score = gobbler.score();
    if (Math.abs(score) == 1) {
        var color = score > 0 ? "red" : "black";
        alert("The winner is " + color);
    } else {
        //setTimeout(scramble, 2000);
    }
}

gobbler.checkForWinner = function () {
    var score = gobbler.score();

    if (Math.abs(score) == 1) {
        var color = score > 0 ? "red" : "black";
        alert("The winner is " + color);
        return score > 0 ? gobbler.RED : gobbler.BLACK;
    } else {
        var legal_moves = gobbler.getLegalMoves(gobbler.current_turn);
        if (legal_moves.length == 0) {
            alert("It's a draw then.");
            return -2;
        }
    }
}

function simulateTurn() {
    gobbler.takeMove(gobbler.current_turn);
    gobbler.current_turn *= -1;

    gobbler.checkForWinner();
    setTimeout(simulateTurn, 1000);
}



gobbler.init();

//jQuery("body").click(function() {setTimeout(simulateTurn, 1000)});
