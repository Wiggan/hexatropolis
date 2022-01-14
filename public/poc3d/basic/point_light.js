'use strict';

class PointLight {
    constructor(position) {
        this.debug = true;
        this.model = models.block;
        this.transform = new Transform();
        this.transform.setPosition(position);
        this.position = position;
    }

    draw(renderer) {
        renderer.add_light(this);
        renderer.add_drawable(this);
    }
}