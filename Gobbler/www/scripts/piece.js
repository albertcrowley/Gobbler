﻿var Piece = function (color) {
    this.color = color; // white or black
    this.x = -1;
    this.y = -1;

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.color).drawCircle(0, 0, 100);
    this.shape.x = 100;
    this.shape.y = 100;

    stage.addChild(this.shape);

    console.log(stage.children);

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
