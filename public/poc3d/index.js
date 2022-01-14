'use strict';

// Global variables that are set and used
// across the application
let renderer,
    scene,
    active_camera,
    program,
    lightDiffuseColor = [1, 1, 1],
    lightDirection = [0, -1, -1],
    sphereColor = [0.5, 0.8, 0.1];

function render() {
    try {
        requestAnimationFrame(render);
        scene.draw(renderer);
        renderer.draw();
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
    active_camera = new DebugCamera([0, 0, 0]);
    render();
    initControls();
}

function updatePosition(e) {
    active_camera.updatePosition(e);
}

function initControls() {     
    var canvas = utils.getCanvas('game_canvas');

    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                            document.mozExitPointerLock;
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }
    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas) {
          console.log('The pointer lock status is now locked');
          document.addEventListener("mousemove", updatePosition, false);
        } else {
          console.log('The pointer lock status is now unlocked');
          document.removeEventListener("mousemove", updatePosition, false);
        }
    }
      

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    window.addEventListener('keyup', (e) => {
        active_camera.onKeyUp(e);
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