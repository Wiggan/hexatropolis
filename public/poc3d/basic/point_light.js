'use strict';

class PointLight {
    constructor(position) {
        this.debug = true;
        this.model = models.block;
        this.transform = new Transform(position);
    }

    getPosition() {
        return this.transform.getPosition();
    }

    draw(renderer) {
        renderer.add_light(this);
        renderer.add_drawable(this);
    }
}