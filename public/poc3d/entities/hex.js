'use strict';

class Hex {
    constructor(position) {
        this.model = models.hex;
        this.transform = new Transform(position);
    }

    draw(renderer) {
        renderer.add_drawable(this);
    }
}