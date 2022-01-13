'use strict';

// Global variables that are set and used
// across the application
let gl,
    models = {},
    entities = [],
    lights = [],
    camera,
    program,
    lightDiffuseColor = [1, 1, 1],
    lightDirection = [0, -1, -1],
    sphereColor = [0.5, 0.8, 0.1],
    projectionMatrix = mat4.create();


class Transform {
    constructor() {
        this.position = [0, 0, 0];
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        // If I ever need non-uniform scaling, then add the normal matrix again.
        //this.normalMatrix = mat4.create();
    }
    
    getWorldMatrix() {
        var worldMatrix = mat4.create();
        mat4.identity(worldMatrix);
        mat4.translate(worldMatrix, worldMatrix, this.position);
        mat4.rotateZ(worldMatrix, worldMatrix, this.roll * Math.PI / 180);
        mat4.rotateY(worldMatrix, worldMatrix, this.yaw * Math.PI / 180);
        mat4.rotateX(worldMatrix, worldMatrix, this.pitch * Math.PI / 180);
        return worldMatrix;
    }
}

class Hex {
    constructor(position) {
        this.model = models.hex;
        this.transform = new Transform();
        this.transform.position = position;
    }

    draw() {
        drawQueue.push(this);
    }
}

class Camera {
    constructor(position) {
        this.transform = new Transform();
        this.transform.position = position;
    }

    getViewMatrix() {
        var viewMatrix = mat4.create();
        //mat4.identity(viewMatrix);
        mat4.invert(viewMatrix, this.transform.getWorldMatrix());
        return viewMatrix;
    }
}

class PointLight {
    constructor(position) {
        this.debug = true;
        this.model = models.block;
        this.transform = new Transform();
        this.transform.position = position;
        this.position = position;
    }
}

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(path) {
    return fetch(path)
    .then(response => response.text())
    .then(shaderString => {
        var shader;
    
        // Assign shader depending on the type of shader
        if (path.split('.').pop() === 'vert') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else if (path.split('.').pop() === 'frag') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else {
            return null;
        }

        // Compile the shader using the supplied shader code
        gl.shaderSource(shader, shaderString);
        gl.compileShader(shader);

        // Ensure the shader is valid
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }).catch(console.error);
}

// Create a program with the appropriate vertex and fragment shaders
async function initProgram() {
    const vertexShader = await getShader('/programs/vertex_shader.vert');
    const fragmentShader = await getShader('/programs/fragment_shader.frag');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aVertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
    program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    program.uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
    program.uMaterialDiffuse = gl.getUniformLocation(program, 'uMaterialDiffuse');
    program.uMaterialAmbient = gl.getUniformLocation(program, 'uMaterialAmbient');
    program.uLightPosition = gl.getUniformLocation(program, 'uLightPosition');
    program.uLightDiffuse = gl.getUniformLocation(program, 'uLightDiffuse');
    program.uLightAmbient = gl.getUniformLocation(program, 'uLightAmbient');
    program.uDebug = gl.getUniformLocation(program, 'uDebug');
}

function init_pipeline() {
}

async function load_model(path) {
    return fetch(path)
    .then(response => response.json())
    .then(model => {    
        // Calculate the normals using the `calculateNormals` utility function
        const normals = utils.calculateNormals(model.vertices, model.indices);

        // Create a VAO
        const vao = gl.createVertexArray();
  

        // Bind VAO
        gl.bindVertexArray(vao);

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        // Configure VAO instructions
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Normals
        const normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        // Configure VAO instructions
        gl.enableVertexAttribArray(program.aVertexNormal);
        gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

        // Setting up the IBO
        model.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        
        // Attach them for later access
        model.vao = vao;

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return model;
    }).catch(console.error);
}

// We call draw to render to our canvas
function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // We will discuss these operations in later chapters
    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 1, 10000);

    const lightPositions = lights.map((light) => {return light.position}).flat();
    gl.uniform3fv(program.uLightPosition, lightPositions);
    gl.uniform4fv(program.uLightDiffuse, [0.4, 0.4, 0.4, 1.0]);
    gl.uniform4fv(program.uLightAmbient, [0.1, 0.1, 0.1, 1.0]);
    gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
    entities.forEach((entity) => {
        var uModelViewMatrix = mat4.create();
        mat4.copy(uModelViewMatrix, camera.getViewMatrix());
        mat4.multiply(uModelViewMatrix, uModelViewMatrix, entity.transform.getWorldMatrix());

        gl.uniformMatrix4fv(program.uModelViewMatrix, false, uModelViewMatrix);   
        gl.uniform4fv(program.uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
        gl.uniform4fv(program.uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]); 
        gl.uniform1i(program.uDebug, entity.debug);
    
        // Use the buffers we've constructed
        gl.bindVertexArray(entity.model.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.model.indexBuffer);

        // Draw to the scene using triangle primitives
        gl.drawElements(gl.TRIANGLES, entity.model.indices.length, gl.UNSIGNED_SHORT, 0);

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    });
}

function render() {
    try {
        requestAnimationFrame(render);
        draw();
    } catch (error) {
        console.error(error);
    }
}

// Entry point to our application
async function init() {
    // Retrieve the canvas
    const canvas = utils.getCanvas('game_canvas');

    // Set the canvas to the size of the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Retrieve a WebGL context
    gl = utils.getGLContext(canvas);
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // Call the functions in an appropriate order
    await initProgram();
    init_pipeline();
    models.block = await load_model('/models/block/part1.json');
    models.sphere = await load_model('/models/sphere/part1.json');
    models.hex = await load_model('/models/hex/part1.json');
    entities.push(new Hex(getHexPosition(0, 3, 0)));
    entities.push(new Hex(getHexPosition(1, 3, 0)));
    entities.push(new Hex(getHexPosition(2, 3, 0)));
    entities.push(new Hex(getHexPosition(3, 3, 0)));
    entities.push(new Hex(getHexPosition(4, 3, 0)));
    entities.push(new Hex(getHexPosition(0, 3, 3)));
    entities.push(new Hex(getHexPosition(0, 3, 1)));
    entities.push(new Hex(getHexPosition(0, 3, 2)));
    entities.push(new Hex(getHexPosition(1, 0, 1)));
    entities.push(new Hex(getHexPosition(1, 0, 2)));
    entities.push(new Hex(getHexPosition(2, 0, 1)));
    entities.push(new Hex(getHexPosition(2, 0, 2)));
    lights.push(new PointLight([6, 2, 8]));
    lights.push(new PointLight([-6, 2, 8]));
    lights.push(new PointLight([3, 2, 10]));
    lights.push(new PointLight([0, 2, 10]));
    lights.forEach(light => {entities.push(light);});
    camera = new Camera([0, 0, 0]);
    render();
    initControls();
}

function updatePosition(e) {
    camera.transform.yaw -= e.movementX/10;
    camera.transform.pitch -= e.movementY/10;
}

function getHexPosition(ix, y, iz) {
    const size = 1;
    return [size * Math.sqrt(3) * (ix + 0.5 * (iz&1)),
        y,
        size * 3/2 * iz];
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
        const viewMatrix = camera.getViewMatrix();
        if (e.key == 'ArrowDown' || e.key == 's' || e.key == 'S') {
            camera.transform.position[0] += viewMatrix[2];
            camera.transform.position[1] += viewMatrix[6];
            camera.transform.position[2] += viewMatrix[10];
            e.preventDefault();
        } else if (e.key == 'ArrowLeft' || e.key == 'a' || e.key == 'A') {
            camera.transform.position[0] -= viewMatrix[0];
            camera.transform.position[1] -= viewMatrix[4];
            camera.transform.position[2] -= viewMatrix[8];
            e.preventDefault();
        } else if (e.key == 'ArrowRight' || e.key == 'd' || e.key == 'D') {
            camera.transform.position[0] += viewMatrix[0];
            camera.transform.position[1] += viewMatrix[4];
            camera.transform.position[2] += viewMatrix[8];
            e.preventDefault();
        } else if (e.key == 'ArrowUp' || e.key == 'w' || e.key == 'W') {
            camera.transform.position[0] -= viewMatrix[2];
            camera.transform.position[1] -= viewMatrix[6];
            camera.transform.position[2] -= viewMatrix[10];
            e.preventDefault();
        }
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