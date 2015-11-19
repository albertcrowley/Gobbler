function init() {
    var stage = new createjs.Stage("gobblerCanvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    // stage.addChild(new createjs.Shape()).setTransform(100,100).graphics.f("red").dc(0,0,50);


    board = new createjs.Shape();
    var g = board.graphics;
    g.setStrokeStyle(20).beginFill("black").beginStroke("black");
    g.moveTo(200, 0).lineTo(200, 800);
    g.moveTo(400, 0).lineTo(400, 800);
    g.moveTo(600, 0).lineTo(600, 800);
    g.moveTo(0, 200).lineTo(800, 200);
    g.moveTo(0, 400).lineTo(800, 400);
    g.moveTo(0, 600).lineTo(800, 600);
    board.x = 100;
    board.y = 560;


    board.space_width = 200; board.space_height = 200;

    var hit = new createjs.Shape();
    hit.graphics.beginFill("white").drawRect(0, 0, 800, 800);
    board.hitArea = hit;

    stage.addChild(board);




    stage.update();
}

console.log("here");
init();