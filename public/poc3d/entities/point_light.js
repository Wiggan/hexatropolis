'use strict';

class PointLight extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.debug = true;
        this.model = models.block;
        this.ambient = [0.01, 0.01, 0.01];
        this.diffuse = [0.6, 0.6, 0.4];
        this.specular = [0.6, 0.6, 0.4];
        this.constant = 1.0;
        this.linear = 0.7;
        this.quadratic = 1.8;
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