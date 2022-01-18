'use strict';

class Drawable extends Entity {
    constructor(parent, local_position, model) {
        super(parent, local_position);
        this.model = model;
        this.material = materials.wall;
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }
}