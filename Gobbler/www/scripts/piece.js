var Piece = function (color, size) {
    this.color = color; // white or black
    this.x = -1;
    this.y = -1;
    switch (Math.abs(size)) {
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

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.color).drawCircle(0, 0, this.radius);
    this.shape.x = this.radius;
    this.shape.y = this.radius;

    console.log("creating a piece");
    stage.addChild(this.shape);
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

