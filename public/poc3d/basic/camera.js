'use strict';


class Camera {
    constructor(position) {
        this.transform = new Transform(position);
    }

    getViewMatrix() {
        var viewMatrix = mat4.create();
        //mat4.identity(viewMatrix);
        mat4.invert(viewMatrix, this.transform.get());
        return viewMatrix;
    }

    getPosition() {
        var position = vec3.create(); 
        mat4.getTranslation(position, this.transform.get());
        return position;
    }


    activate() {
        active_camera.deactivate();
        active_camera = this;
    }

    deactivate() {}
}
