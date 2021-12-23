

var world;
var debug = false;

function init() {


    world = new World();
    init_controls();
    

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

var previous_timestamp;
function gameLoop(timestamp) {
    if (previous_timestamp === undefined) { previous_timestamp = timestamp; }
    var elapsed = (timestamp - previous_timestamp) / 1000;
    previous_timestamp = timestamp;
    world.update(elapsed);
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    begin_frame();
    translate_to_position(world.player.position);
    world.draw();
    end_frame();
}
