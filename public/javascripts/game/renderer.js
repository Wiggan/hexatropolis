var game_canvas;
var fog_of_war_canvas;
var effect_canvas;
var hud_canvas;
var game_context;

game_canvas = document.getElementById('game_canvas');
shadow_canvas = document.getElementById('shadow_canvas');
actor_canvas = document.getElementById('actor_canvas');
fog_of_war_canvas = document.getElementById('fog_of_war_canvas');
effect_canvas = document.getElementById('effect_canvas');
hud_canvas = document.getElementById('hud_canvas');
game_context = game_canvas.getContext('2d');
shadow_context = shadow_canvas.getContext('2d');
actor_context = actor_canvas.getContext('2d');
fog_of_war_context = fog_of_war_canvas.getContext('2d');


function begin_frame() {
    game_context.fillStyle = "black";
    game_context.fillRect(0, 0, game_canvas.clientWidth, game_canvas.clientHeight);
    fog_of_war_context.fillStyle = "black";
    fog_of_war_context.fillRect(0, 0, fog_of_war_canvas.clientWidth, fog_of_war_canvas.clientHeight);
    shadow_context.clearRect(0, 0, shadow_canvas.clientWidth, shadow_canvas.clientHeight);
    actor_context.clearRect(0, 0, actor_canvas.clientWidth, actor_canvas.clientHeight);
    game_context.save();
    shadow_context.save();
    actor_context.save();
    fog_of_war_context.save();
}

function end_frame() {
    game_context.restore();
    shadow_context.restore();
    actor_context.restore();
    fog_of_war_context.restore();
}

function translate_to_position(position) {
    var x = -Math.round(position.x) + game_canvas.clientWidth/2/scale;
    var y = -Math.round(position.y) + game_canvas.clientHeight/2/scale;
    game_context.translate(x, y);
    shadow_context.translate(x, y);
    actor_context.translate(x, y);
    fog_of_war_context.translate(x, y);
}

function draw_actor({position, sprite, angle, collision}) {
    actor_context.save();
    if (angle != 0) {
        actor_context.translate(Math.round(position.x), Math.round(position.y)-sprite.height/2);
        actor_context.rotate(angle);
        actor_context.translate(-Math.round(position.x), -Math.round(position.y)+sprite.height/2);
    }
    actor_context.drawImage(sprite, Math.round(position.x) - sprite.width / 2, Math.round(position.y)-sprite.height);
    actor_context.restore();
    if (debug) {
        actor_context.save();
        actor_context.translate(Math.round(position.x), Math.round(position.y));
        actor_context.fillStyle = "red";
        actor_context.fillRect(0, 0, 1, 1);
        actor_context.translate(Math.round(collision.x), Math.round(collision.y));
        actor_context.fillStyle = "green";
        fill_circle(actor_context, collision.radius);
        actor_context.restore();
    }
}

function fill_circle(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
    ctx.fill();   
}

function draw_shadow({position, radius}) {
    shadow_context.save();
    shadow_context.translate(Math.round(position.x), Math.round(position.y));    
    
    var radgrad = fog_of_war_context.createRadialGradient(0,0,0,0,0,radius);
    radgrad.addColorStop(0, 'rgba(0,0,0,0.7)');
    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
    shadow_context.fillStyle = radgrad;
    fill_circle(shadow_context, radius);
    shadow_context.restore();
}
// TODO store gradients in a map with brightness as key for reuse.
function draw_light({position, brightness}) {
    fog_of_war_context.save();
    fog_of_war_context.globalCompositeOperation = 'destination-out';
    fog_of_war_context.translate(Math.round(position.x), Math.round(position.y));

    var radgrad = fog_of_war_context.createRadialGradient(0,0,0,0,0,20*brightness);
    radgrad.addColorStop(0, 'rgba(255,255,255,1)');
    radgrad.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
    fog_of_war_context.fillStyle = radgrad;
    fill_circle(fog_of_war_context, 20*brightness);
    fog_of_war_context.restore();
}