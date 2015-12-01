var Piece = function (color, piece_size) {
    this.color = color; // white or black
    this.x = -1;
    this.y = -1;
    this.size = piece_size;
    this.shape = new createjs.Shape();
    this.setSize(piece_size);
    this.shape.x = this.radius;
    this.shape.y = this.radius;
    this.shape.container = this;

    console.log("creating a piece");
    stage.addChild(this.shape);
}

Piece.prototype.setSize = function (piece_size) {
    if (piece_size > 4 || piece_size < 1) {
        console.log("invalid piece size.");
    }

    this.size = piece_size;
    switch (Math.abs(piece_size)) {
        case 4:
            this.radius = 75;
            break;
        case 3:
            this.radius = 55;
            break;
        case 2:
            this.radius = 35;
            break;
        case 1:
            this.radius = 10;
            break;
    }
    this.shape.graphics = new createjs.Graphics();
    this.shape.graphics.beginFill(this.color).drawCircle(0, 0, this.radius);
}

Piece.prototype.move = function (x,y) {
    this.x = x;
    this.y = y;
}


/**
* Returns true if the piece is on the board
*/
Piece.prototype.onBoard = function () {
    return (this.x != -1);
}

