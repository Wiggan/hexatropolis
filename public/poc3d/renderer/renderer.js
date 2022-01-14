'use strict';

var gl;

class Renderer {
    constructor() {
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

    }

    add_drawable(drawable) {
        this.drawables.push(drawable);
    }

    add_light(light) {
        this.lights.push(light);
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
