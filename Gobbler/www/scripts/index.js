// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

var stage, circle;
function init() {


    console.log("inside init");
    stage = new createjs.Stage("gobblerCanvas");
    reflow();
    window.addEventListener("resize", reflow, false);


    /*
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;

    circle.addEventListener("click", function (event) {
        circle.graphics.clear().beginFill("green").drawCircle(0, 0, 50);
    });
    */

    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setFPS(30);

    stage.addChild(circle);
    stage.addChild(createBoard());

    stage.update();
}

function createBoard() {
    var board = new createjs.Shape();
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

    var hit = new createjs.Shape();
    hit.graphics.beginFill("white").drawRect(0, 0, 800, 800);
    board.hitArea = hit;

    board.addEventListener("click", boardClick)
    return (board);
}

function boardClick(event) {

    lx = event.localX;
    ly = event.localY;
    spotx = Math.floor(lx / 200);
    spoty = Math.floor(ly / 200);

    if ((lx % 200) < 20 || (lx % 200) > 180) {
        console.log("line!")
        return;
    }
    if ((ly % 200) < 20 || (ly % 200) > 180) {
        console.log("line!")
        return;
    }

    console.log("clicked on spot " + spotx + " - " + spoty);
}

function tick(event) {
    /*
    var mydelta = Math.abs( (event.timeStamp % 4000) - 2000);
    circle.x = 100 +  (mydelta) / 10;
    stage.update();
    */
    stage.update();
}


function reflow() {
    // 2d vectors to store various sizes
    var browser = [
        window.innerWidth-10, window.innerHeight-10];
    // Minimum scale to fit whole canvas
    var scale = this.scale = Math.min(
        browser[0] / stage.canvas.width,
        browser[1] / stage.canvas.height);
    // Scaled content size
    var size = [
        stage.canvas.width * scale, stage.canvas.height * scale];
    // Offset from top/left
    var offset = this.offset = [
        (browser[0] - size[0]) / 2, (browser[1] - size[1]) / 2];

    // Apply CSS transform
    var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scale + ")";
    document.getElementById("game").style.transform = rule;
    document.getElementById("game").style.webkitTransform = rule;
};


init();
