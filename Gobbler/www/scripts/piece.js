var Piece = function (color) {
    this.color = color; // white or black
    this.x = -1;
    this.y = -1;
    this.radius = 75;

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

