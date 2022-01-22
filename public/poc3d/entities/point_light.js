'use strict';

var lights = [];

class PointLight extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        lights.push(this);
        this.active = false;
        this.model = models.block;
        this.ambient = [0.01, 0.01, 0.01];
        this.diffuse = [0.6, 0.6, 0.4];
        this.specular = [0.6, 0.6, 0.4];
        this.constant = 1.0;
        this.linear = 0.35;
        this.quadratic = 0.9;
    }

    getPosition() {
        var position = vec3.create(); 
        mat4.getTranslation(position, this.getWorldTransform());
        return position;
    }

    draw(renderer) {
        super.draw(renderer);
        if (this.active) {
            renderer.add_light(this);
        }
        if (debug) {
            //renderer.add_drawable(this);
        }
    }

    activate() {
        this.active = true;
    }
    inactivate() {
        this.active = false;
    }
}