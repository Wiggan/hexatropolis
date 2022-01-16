'use strict';

class PointLight extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.debug = true;
        this.model = models.block;
    }

    getPosition() {
        var position = vec3.create(); 
        mat4.getTranslation(position, this.getWorldTransform());
        return position;
    }

    draw(renderer) {
        renderer.add_light(this);
        if (debug) {
            renderer.add_drawable(this);
        }
    }
}