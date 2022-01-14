'use strict';

class Hex {
    constructor(position) {
        this.model = models.hex;
        this.transform = new Transform();
        this.transform.setPosition(position);
    }

    draw(renderer) {
        renderer.add_drawable(this);
    }
}