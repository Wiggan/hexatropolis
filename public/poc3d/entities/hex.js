'use strict';

class Hex extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.model = models.hex;
    }

    draw(renderer) {
        renderer.add_drawable(this);
    }
}