'use strict'

class TrackingCamera extends Camera {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.local_transform.pitch(-60);
        this.x = 0;
        this.y = 0;
    }

    activate() {
        document.addEventListener("mousemove", active_camera.updatePosition, false);
    }
    
    deactivate() {
        document.removeEventListener("mousemove", active_camera.updatePosition, false);
    }

    updatePosition(e) {
        active_camera.x = e.clientX;
        active_camera.y = e.clientY;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
    }

    onKeyUp(e) {

    }

    onclick(e) {

    }

    draw(renderer) {
        const rect = gl.canvas.getBoundingClientRect();
        const clipX = (this.x - rect.left) / rect.width  *  2 - 1;
        const clipY = (this.y - rect.top) / rect.height * -2 + 1;

        //console.log(`clipX: ${clipX}, clipY: ${clipY}`);

        var unproj = mat4.create();
        mat4.mul(unproj, projection_matrix, this.getViewMatrix());
        mat4.invert(unproj, unproj);
        var world = vec4.fromValues(clipX, clipY, Math.sin(Date.now()*0.005) * 5.0 + 2.5, 1.0);
        
        vec4.transformMat4(world, world, unproj);
        
        
        var world_transform = mat4.create();
        mat4.fromTranslation(world_transform, world);

        renderer.add_drawable(models.sphere, materials.light, world_transform);
        console.log(`X: ${world[0]}, Y: ${world[1]}, Z: ${world[2]}`);
    }
}