'use strict';


class Camera {
    constructor(position) {
        this.transform = new Transform();
        this.transform.setPosition(position);
    }

    getViewMatrix() {
        var viewMatrix = mat4.create();
        //mat4.identity(viewMatrix);
        mat4.invert(viewMatrix, this.transform.getWorldMatrix());
        return viewMatrix;
    }
}
