gobbler = new Object();


gobbler.board_state = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

gobbler.red_pieces = [];
gobbler.black_pieces = [];

gobbler.init = function () {

    for (i=0; i < 3; i++) {
        this.red_pieces[i] = new Piece("red");
        this.black_pieces[i] = new Piece("black");
    }
    console.log(this);

};


gobbler.draw = function () {

}

gobbler.init();
