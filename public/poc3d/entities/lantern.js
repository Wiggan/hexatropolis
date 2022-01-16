'use strict';

class Lantern extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.model = models.sphere;
        new PointLight(this, [0,3,0]);
        new Hex(this, [0,0,0]);
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }
}