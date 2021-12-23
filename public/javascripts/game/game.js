var game_canvas;
var fog_of_war_canvas;
var effect_canvas;
var hud_canvas;
var game_context;

var world;

function init() {
    game_canvas = document.getElementById('game_canvas');
    fog_of_war_canvas = document.getElementById('fog_of_war_canvas');
    effect_canvas = document.getElementById('effect_canvas');
    hud_canvas = document.getElementById('hud_canvas');
    game_context = game_canvas.getContext('2d');

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
    game_context.save();
    game_context.fillStyle = "black";
    game_context.fillRect(0, 0, game_canvas.clientWidth, game_canvas.clientHeight);
    //var screen = screen_to_world({x: 0, y: 0});
    game_context.translate(-Math.round(world.player.position.x) + game_canvas.clientWidth/2/scale, -Math.round(world.player.position.y) + game_canvas.clientHeight/2/scale);
    //game_context.translate(-world.player.position.x + 108/2, -world.player.position.y  + 72/2);
    world.draw(game_context);
    game_context.restore();
}
