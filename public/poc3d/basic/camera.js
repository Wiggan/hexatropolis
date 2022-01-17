'use strict';


class Camera extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
    }

    getViewMatrix() {
        var viewMatrix = mat4.create();
        //mat4.identity(viewMatrix);
        mat4.invert(viewMatrix, this.getWorldTransform());
        return viewMatrix;
    }

    getPosition() {
        var position = vec3.create(); 
        mat4.getTranslation(position, this.getWorldTransform());
        return position;
    }


    activate() {
        active_camera.deactivate();
        active_camera = this;
    }

    deactivate() {}
}
