'use strict';

// Global variables that are set and used
// across the application
let renderer,
    scene,
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
    active_camera.activate();

    render();
    initControls();
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function initControls() {     
    
    var canvas = utils.getCanvas('text_canvas');
    canvas.onmousedown = (e) => {
        active_camera.onmousedown(e);
    }
    canvas.onmouseup = (e) => {
        active_camera.onmouseup(e);
    }
    canvas.onclick = (e) => {
        active_camera.onclick(e);
    }
    canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
    window.addEventListener('keyup', (e) => {
        active_camera.onKeyUp(e);
    });
    window.addEventListener('keydown', (e) => {
        if (e.key == 's' && e.ctrlKey) {
            download('materials.json', JSON.stringify(materials))
            //console.log(JSON.stringify(materials));
            e.preventDefault();
        }
        active_camera.onKeyDown(e);
    });

    var controls = {};
    for (const [key, value] of Object.entries(materials)) {
        controls[key] = {
            'Diffuse': {
                value: denormalizeColor(value.diffuse),
                onChange: v => value.diffuse = normalizeColor(v)
            },
            'Ambient': {
                value: denormalizeColor(value.ambient),
                onChange: v => value.ambient = normalizeColor(v)
            },
            'Specular': {
                value: denormalizeColor(value.specular),
                onChange: v => value.specular = normalizeColor(v)
            },
            'Shininess': {
                value: value.shininess,
                min: 1, max: 50, step: 0.1,
                onChange: v => value.shininess = v
            },
            'Light': {
                value: value.isLight,
                onChange: v => value.isLight = v
            },
        }
    }
    controls.lights = {
        'Diffuse': {
            value: denormalizeColor(LanternLight.Diffuse),
            onChange: v => lights.forEach(light => light.diffuse = normalizeColor(v))
        },
        'Ambient': {
            value: denormalizeColor(LanternLight.Ambient),
            onChange: v => lights.forEach(light => light.ambient = normalizeColor(v))
        },
        'Specular': {
            value: denormalizeColor(LanternLight.Specular),
            onChange: v => lights.forEach(light => light.specular = normalizeColor(v))
        },
        'Constant': {
            value: 1,
            min: 0, max: 2, step: 0.1,
            onChange: v => lights.forEach(light => light.constant = v)
        },
        'Linear': {
            value: 0.35,
            min: 0, max: 10, step: 0.05,
            onChange: v => lights.forEach(light => light.linear = v)
        },
        'Quadratic': {
            value: 0.9,
            min: 0, max: 10, step: 0.05,
            onChange: v => lights.forEach(light => light.quadratic = v)
        },
    }


    utils.configureControls(controls);
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