'use strict';


class Camera {
    constructor(position) {
        this.transform = new Transform(position);
    }

    getViewMatrix() {
        var viewMatrix = mat4.create();
        //mat4.identity(viewMatrix);
        mat4.invert(viewMatrix, this.transform.getWorldMatrix());
        return viewMatrix;
    }

    activate() {
        active_camera.deactivate();
        active_camera = this;
    }

    deactivate() {}
}
