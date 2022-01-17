'use strict';

// Global variables that are set and used
// across the application
let renderer,
    scene,
    active_camera,
    lightDiffuseColor = [1, 1, 1],
    lightDirection = [0, -1, -1],
    sphereColor = [0.5, 0.8, 0.1];

var then = Date.now();
var now = Date.now();
function render() {
    try {
        requestAnimationFrame(render);
        now = Date.now();
        scene.update(now - then);
        then = now;
        scene.draw(renderer);
        //renderer.draw_with_bloom();
        renderer.render();
    } catch (error) {
        console.error(error);
    }
}

// Entry point to our application
async function init() {
    
    renderer = new Renderer();
    await initProgram();
    await load_all_models();
    scene = new Scene();

    render();
    initControls();
}

function initControls() {     
    var canvas = utils.getCanvas('game_canvas');

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    canvas.onclick = function(e) {
        active_camera.onclick(e);
    }
    window.addEventListener('keyup', (e) => {
        active_camera.onKeyUp(e);
    });
    window.addEventListener('keydown', (e) => {
        active_camera.onKeyDown(e);
    });
}

// De-normalize colors from 0-1 to 0-255
function denormalizeColor(color) {
    return color.map((c) => c * 255);
}

// Normalize colors from 0-255 to 0-1
function normalizeColor(color) {
    return color.map((c) => c / 255);
}

// Call init once the webpage has loaded
window.onload = init;