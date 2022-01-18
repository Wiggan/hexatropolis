'use strict'

class TrackingCamera extends Camera {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.transform.pitch(-60);//.lookAt([0,0,0]);
        this.transform.yaw(0);
    }

    activate() {
        document.addEventListener("mousemove", active_camera.updatePosition, false);
    }
    
    deactivate() {
        document.removeEventListener("mousemove", active_camera.updatePosition, false);
    }

    updatePosition(e) {
        console.log(`X: ${e.offsetX}, Y: ${e.offsetY}`);
        var unproj = mat4.create();
        mat4.mul(unproj, projection_matrix, this.getViewMatrix());
        mat4.invert(unproj, unproj);
        var world = vec4.fromValues(e.offsetX, e.offsetY, 0.0, 1.0);
        vec4.transformMat4(world, world, unproj);
    }

    onKeyDown(e) {
        super.onKeyDown(e);
    }

    onKeyUp(e) {

    }

    onclick(e) {

    }

    update(elapsed) {
        super.update(elapsed);

    }

    draw(renderer) {

    }
}