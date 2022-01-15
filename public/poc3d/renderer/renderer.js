'use strict';

var gl;

class Renderer {
    constructor() {
        this.offscreenTextures = [];
        this.framebuffer;
        this.projectionMatrix = mat4.create();
        this.drawables = [];
        this.lights = [];

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

        this.setup_textures();
        this.configureGeometry();
    }

    setup_textures() {
        // Texture
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        
        // Set up texture so we can render any size image and so we are
        // working with pixels.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Render buffer
        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

        // Frame buffer
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        // Clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    add_drawable(drawable) {
        this.drawables.push(drawable);
    }

    add_light(light) {
        this.lights.push(light);
    }

    render() {
        this.validateSize();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        this.draw();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.draw_post_process();
    }


    validateSize() {
        // 1. Resize Color Texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // 2. Resize Render Buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

        // 3. Clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    draw_post_process() {


        // Use the Post Process shader
        gl.useProgram(ppProgram);

        // Bind the quad geometry
        gl.enableVertexAttribArray(ppProgram.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(ppProgram.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(ppProgram.aVertexTextureCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(ppProgram.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);

        // Bind the texture from the framebuffer
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(ppProgram.uSampler, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    configureGeometry() {
        // Define the geometry for the full-screen quad
        const vertices = [
          -1, -1,
          1, -1,
          -1, 1,
          -1, 1,
          1, -1,
          1, 1
        ];
    
        const textureCoords = [
          0, 0,
          1, 0,
          0, 1,
          0, 1,
          1, 0,
          1, 1
        ];
    
        // Init the buffers
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    
        // Clean up
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }

    draw() {
        gl.useProgram(program);
        // Clear the scene
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // We will discuss these operations in later chapters
        mat4.perspective(this.projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 1, 10000);
    
        //const lightPositions = this.lights.map((light) => {return light.getPosition()}).flat();
        gl.uniform3fv(program.uLightPosition, this.lights[0].getPosition());
        gl.uniform4fv(program.uLightDiffuse, [0.4, 0.4, 0.4, 1.0]);
        gl.uniform4fv(program.uLightSpecular, [0.4, 0.4, 0.4, 1.0]);
        gl.uniform4fv(program.uLightAmbient, [0.1, 0.1, 0.1, 1.0]);
        gl.uniformMatrix4fv(program.uProjectionMatrix, false, this.projectionMatrix);
        this.drawables.forEach((entity) => {
            var modelViewMatrix = mat4.create();
            mat4.copy(modelViewMatrix, active_camera.getViewMatrix());
            mat4.multiply(modelViewMatrix, modelViewMatrix, entity.transform.getWorldMatrix());
    
            var normalMatrix = mat4.create();
            mat4.copy(normalMatrix, modelViewMatrix);
            mat4.invert(normalMatrix, normalMatrix);
            mat4.transpose(normalMatrix, normalMatrix);
    
            gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);   
            gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
            gl.uniform4fv(program.uMaterialDiffuse, [1.0, 1.0, 1.0, 1.0]);
            gl.uniform4fv(program.uMaterialAmbient, [1.0, 1.0, 1.0, 1.0]); 
            gl.uniform4fv(program.uMaterialSpecular, [1.0, 1.0, 1.0, 1.0]); 
            gl.uniform1f(program.uShininess, 4.0); 
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
        this.drawables.length = 0;
        this.lights.length = 0;
    }
}
