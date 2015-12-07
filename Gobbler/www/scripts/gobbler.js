gobbler = new Object();
gobbler.stageHeight = 1920;
gobbler.stageWidth = 1080;

gobbler.board_state = [[new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()],
                       [new Stack(), new Stack(), new Stack(), new Stack()]];

gobbler.RESERVE_STACK_COUNT = 3;
gobbler.reserve_state_red = [new Stack(), new Stack(), new Stack()];
gobbler.reserve_state_black = [new Stack(), new Stack(), new Stack()];

gobbler.win_vectors = [];

gobbler.pieces = [[],[]];
gobbler.RED = 1;
gobbler.RED_MIN = -1;
gobbler.RED_MAX = 1;
gobbler.BLACK = -1;
gobbler.BLACK_MIN = 1;
gobbler.BLACK_MAX = -1;
gobbler.NUMPIECES = 12;
gobbler.MAX_PIECE_SIZE = 4;
gobbler.selectedPiece = null;

gobbler.current_turn = gobbler.RED;



gobbler.init = function () {
    var x = 100;
    var red_y = 1800;
    var black_y = 100;
    var reserve_stack = -1;
    for (i=0; i < this.NUMPIECES; i++) {
        // we are making 3 stacks, so every 4 pieces, increment x
        if (i % 4 == 0) { x += 200; reserve_stack++}

        this.pieces[0][i] = new Piece("red", i % gobbler.MAX_PIECE_SIZE + 1);
        this.reserve_state_red[reserve_stack].Push(this.pieces[0][i]);
        this.pieces[0][i].shape.x = x;
        this.pieces[0][i].shape.y = red_y;


        this.pieces[1][i] = new Piece("black", (i % gobbler.MAX_PIECE_SIZE + 1) * -1);
        this.reserve_state_black[reserve_stack].Push(this.pieces[1][i]);
        this.pieces[1][i].shape.y = black_y;
        this.pieces[1][i].shape.x = x;

        this.pieces[0][i].shape.addEventListener("click", gobbler.selectPiece);


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
                    p.setSize(top_piece);
                    //console.log("setting piece to size " + top_piece);
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
    return;
/*    var radius = this.pieces[0][0].radius;
    for (i = 0; i < this.NUMPIECES; i++) {   
        this.pieces[1][i].shape.x = 75 + i * radius * 2;
        this.pieces[1][i].shape.y = 75;
        this.pieces[0][i].shape.x = 75 + i * radius * 2;
        this.pieces[0][i].shape.y = gobbler.stageHeight - 75;
        this.pieces[0][i].x = -1; this.pieces[0][i].y = -1;
        this.pieces[1][i].x = -1; this.pieces[1][i].y = -1;
    }
    */
}

gobbler.takeMove = function (color) {
    var betterScore = function (color, new_score, old_score) { if (color == gobbler.RED) { return new_score > old_score } else { return new_score < old_score } };
    var min_score = color == gobbler.RED ? gobbler.RED_MIN : gobbler.BLACK_MIN;

    var move_list = this.getLegalMoves(color);
    var best_move = new Object(); best_move.score = min_score; best_move.x = -1; best_move.y = -1;

    _.each(move_list, function (move, idx, ctx) {
        // make the move
        var x = move[0];
        var y = move[1];
        var piece = move[2];
        gobbler.board_state[x][y].Push(piece.size);
        score = gobbler.score();
        if ( betterScore(color, score, best_move.score)) {
            best_move.x = move[0];
            best_move.y = move[1];
            best_move.piece = piece;
            best_move.score = score;
        }
        //undo the move
        gobbler.board_state[move[0]][move[1]].Pop(); // undo the move
    });


    if (best_move.x == -1) {
        console.log("couldn't find a move!");
    } else {
        gobbler.board_state[best_move.x][best_move.y].Push(best_move.piece.size * best_move.piece.color);
        gobbler.movePiece(best_move.piece, best_move.x, best_move.y);
        gobbler.removeFromReserve(best_move.piece);
        stage.update();
        console.log("moving a piece of size " + best_move.piece.size + " to " + best_move.x + " - " + best_move.y);
        
    }

}

gobbler.removeFromReserve = function (piece) {
    var reserve = (piece.color == gobbler.BLACK || piece.color == "black") ? gobbler.reserve_state_black : gobbler.reserve_state_red;
    for (var stack = 0; stack < gobbler.RESERVE_STACK_COUNT; stack++) {
        if (reserve[stack].Peek() == piece) {
            reserve[stack].Pop();
        }
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
    var reserve = (color == gobbler.BLACK) ? gobbler.reserve_state_black : gobbler.reserve_state_red;

    for (var stack = 0; stack < gobbler.RESERVE_STACK_COUNT; stack++) {
        if (reserve[stack].Peek() == null) { continue; }
        var size = reserve[stack].Peek().size;
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                if (move_matrix[x][y]) { 
                    move_list.push([x, y, reserve[stack].Peek() ] ); 
                    //console.log("pushing size " + size + " for " + x + " - " + y);
                };
            }
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
            return spot.UnitPeek();
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


gobbler.selectPiece = function (event) {
    gobbler.selectedPiece = event.target.container;
    console.log(event);
}


gobbler.boardClick = function (x, y) {
    if (gobbler.current_turn == gobbler.RED && gobbler.selectedPiece != null) {
        if (gobbler.board_state[x][y].Peek() == null) {
            gobbler.board_state[x][y].Push(gobbler.selectedPiece.size);
            gobbler.movePiece(gobbler.selectedPiece, x, y);
            gobbler.checkForWinner();
            gobbler.current_turn *= -1;
            stage.update();
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
