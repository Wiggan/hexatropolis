'use strict';

var program, ppProgram;

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

async function initProgram() {
    // Normal shaders
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
    program.uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');
    program.uMaterialAmbient = gl.getUniformLocation(program, 'uMaterialAmbient');
    program.uMaterialDiffuse = gl.getUniformLocation(program, 'uMaterialDiffuse');
    program.uMaterialSpecular = gl.getUniformLocation(program, 'uMaterialSpecular');
    program.uShininess = gl.getUniformLocation(program, 'uShininess');
    program.uLightPosition = gl.getUniformLocation(program, 'uLight.position');
    program.uLightDiffuse = gl.getUniformLocation(program, 'uLight.diffuse');
    program.uLightSpecular = gl.getUniformLocation(program, 'uLight.specular');
    program.uLightAmbient = gl.getUniformLocation(program, 'uLightAmbient');
    program.uDebug = gl.getUniformLocation(program, 'uDebug');

    // Post processing shaders
    const ppVertexShader = await getShader('/programs/post_processing_vexter_shader.vert');
    const ppFragmentShader = await getShader('/programs/glow_fragment_shader.frag');

    // Create a program
    ppProgram = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(ppProgram, ppVertexShader);
    gl.attachShader(ppProgram, ppFragmentShader);
    gl.linkProgram(ppProgram);

    if (!gl.getProgramParameter(ppProgram, gl.LINK_STATUS)) {
        console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(ppProgram);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    ppProgram.aVertexPosition = gl.getAttribLocation(ppProgram, 'aVertexPosition');
    ppProgram.aVertexTextureCoords = gl.getAttribLocation(ppProgram, 'aVertexTextureCoords');
    ppProgram.uSampler = gl.getUniformLocation(ppProgram, 'uSampler');
}
