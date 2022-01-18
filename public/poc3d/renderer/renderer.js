'use strict';

var gl, projection_matrix = mat4.create();

class Renderer {
    constructor() {
        this.offscreenTextures = [];
        this.framebuffer;
        this.pingpongTextures = [];
        this.pingpongFramebuffers = [];
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

    create_texture() {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        return texture;
    }

    setup_textures() {
        // Textures
        this.offscreenTextures.push(this.create_texture());
        this.offscreenTextures.push(this.create_texture());

        // Render buffer
        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

        // Frame buffer
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        for (var i = 0; i < 2; i++) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl['COLOR_ATTACHMENT' + i], gl.TEXTURE_2D, this.offscreenTextures[i], 0);
        }
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);


        // Textures for ping pong
        for (var i = 0; i < 2; i++) {
            this.pingpongFramebuffers.push(gl.createFramebuffer());
            this.pingpongTextures.push(this.create_texture());
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.pingpongFramebuffers[i]);
            gl.bindTexture(gl.TEXTURE_2D, this.pingpongTextures[i]);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pingpongTextures[i], 0);
        }
        
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

        var horizontal = true, first_iteration = true;
        var amount = 10;
        gl.useProgram(gaussian_blur_program);
        for (var i = 0; i < amount; i++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.pingpongFramebuffers[horizontal ? 1 : 0]); 
            gl.uniform1i(gaussian_blur_program.horizontal, horizontal);

            gl.activeTexture(gl.TEXTURE0);
            var tex = first_iteration == true ? this.offscreenTextures[1] : this.pingpongTextures[!horizontal ? 1 : 0];
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(gaussian_blur_program.image, 0);
            
            this.render_quad(gaussian_blur_program);
            horizontal = !horizontal;
            if (first_iteration) first_iteration = false;
        }


        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.draw_post_process();
    }


    validateSize() {
        // 1. Resize Color Texture
        for (var i = 0; i < 2; i++) {
            gl.bindTexture(gl.TEXTURE_2D, this.offscreenTextures[i]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        for (var i = 0; i < 2; i++) {
            gl.bindTexture(gl.TEXTURE_2D, this.pingpongTextures[i]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }

        // 2. Resize Render Buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);

        // 3. Clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    render_quad(p) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Bind the quad geometry
        gl.enableVertexAttribArray(p.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(p.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(p.aVertexTextureCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(p.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Cleanup
        gl.activeTexture(gl.TEXTURE0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw_post_process() {
        // Use the Post Process shader
        gl.useProgram(ppProgram);
        
        // Bind the textures from the framebuffer
        //for (var i = 0; i < 2; i++) {
        //    gl.activeTexture(gl['TEXTURE' + i]);
        //    gl.bindTexture(gl.TEXTURE_2D, this.offscreenTextures[i]);
        //    gl.uniform1i(ppProgram['uSampler' + i], i);
        //}
        gl.activeTexture(gl['TEXTURE' + 0]);
        gl.bindTexture(gl.TEXTURE_2D, this.offscreenTextures[0]);
        gl.uniform1i(ppProgram['uSampler' + 0], 0);
        gl.activeTexture(gl['TEXTURE' + 1]);
        gl.bindTexture(gl.TEXTURE_2D, this.pingpongTextures[1]);
        gl.uniform1i(ppProgram['uSampler' + 1], 1);
        
        this.render_quad(ppProgram);
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

    setMaterial(program, material) {
        gl.uniform3fv(program['uMaterial.diffuse'], material.diffuse);
        gl.uniform3fv(program['uMaterial.ambient'], material.ambient); 
        gl.uniform3fv(program['uMaterial.specular'], material.specular); 
        gl.uniform1f(program['uMaterial.shininess'], material.shininess); 
        gl.uniform1i(program['uMaterial.isLight'], material.isLight);
    }

    draw() {
        gl.useProgram(program);
        // Clear the scene
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // We will discuss these operations in later chapters
        mat4.perspective(projection_matrix, 45, gl.canvas.width / gl.canvas.height, 1, 10000);
    
        //const lightPositions = this.lights.map((light) => {return light.getPosition()}).flat();
        for (var i = 0; i < 4 && i < this.lights.length; i++) {
            gl.uniform3fv(program['uLight[' + i + '].position'], this.lights[i].getPosition());
            gl.uniform3fv(program['uLight[' + i + '].ambient'], this.lights[i].ambient);
            gl.uniform3fv(program['uLight[' + i + '].diffuse'], this.lights[i].diffuse);
            gl.uniform3fv(program['uLight[' + i + '].specular'], this.lights[i].specular);
            gl.uniform1f(program['uLight[' + i + '].constant'], this.lights[i].constant);
            gl.uniform1f(program['uLight[' + i + '].linear'], this.lights[i].linear);
            gl.uniform1f(program['uLight[' + i + '].quadratic'], this.lights[i].quadratic);
        }
        gl.uniform3fv(program.uCameraPos, active_camera.getPosition()); 
        gl.uniformMatrix4fv(program.uProjectionMatrix, false, projection_matrix);
        gl.uniformMatrix4fv(program.uViewMatrix, false, active_camera.getViewMatrix());
        this.drawables.forEach((entity) => {
            gl.uniformMatrix4fv(program.uModelMatrix, false, entity.getWorldTransform());
            
            var modelViewMatrix = mat4.create();
            mat4.copy(modelViewMatrix, active_camera.getViewMatrix());
            mat4.multiply(modelViewMatrix, modelViewMatrix, entity.getWorldTransform());
    
            var normalMatrix = mat4.create();
            mat4.copy(normalMatrix, modelViewMatrix);
            mat4.invert(normalMatrix, normalMatrix);
            mat4.transpose(normalMatrix, normalMatrix);
    
            gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
            gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
            gl.uniform1i(program.uDebug, entity.debug);
            if (!entity.debug) {
                this.setMaterial(program, entity.material);
            }

        
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
