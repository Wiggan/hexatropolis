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

    }

    setup_textures() {
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        for (var i = 0; i < 2; i++) {
            var offscreenTexture = this.createAndSetupTexture();
            this.offscreenTextures.push(offscreenTexture);
        }
    }

    createAndSetupTexture() {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
     
        // Set up texture so we can render any size image and so we are
        // working with pixels.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
     

         // make the texture the same size as the image
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var border = 0;                 // must be 0
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE  // type of data we are supplying
        var data = null;                // no data = create a blank texture
        gl.texImage2D(
            gl.TEXTURE_2D, mipLevel, internalFormat, gl.canvas.width, gl.canvas.height, border,
            srcFormat, srcType, data);
 

        return texture;
    }

    add_drawable(drawable) {
        this.drawables.push(drawable);
    }

    add_light(light) {
        this.lights.push(light);
    }


    draw_with_bloom() {
        // Clear the scene
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // We will discuss these operations in later chapters
        mat4.perspective(this.projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 1, 10000);
        
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        
        // Tell the shader the resolution of the framebuffer.
        //gl.uniform2f(resolutionLocation, width, height);
 

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.offscreenTextures[0], 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.offscreenTextures[1], 0);

        const lightPositions = this.lights.map((light) => {return light.getPosition()}).flat();
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
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
        this.drawables.length = 0;
        this.lights.length = 0;
    }




    draw() {
        // Clear the scene
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // We will discuss these operations in later chapters
        mat4.perspective(this.projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 1, 10000);
    
        const lightPositions = this.lights.map((light) => {return light.getPosition()}).flat();
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
