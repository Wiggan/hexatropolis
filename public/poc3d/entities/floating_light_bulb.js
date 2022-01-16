'use strict';

class FloatingLightBulb extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.model = models.sphere;
        this.light = new PointLight(this, [0,0,0]);
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }
}