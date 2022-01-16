'use strict';

class Lantern extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.light = new FloatingLightBulb(this, [0,3,0]);
        this.hex = new Hex(this, [0,0,0]);
    }

    draw(renderer) {
        super.draw(renderer);
    }

    update(elapsed) {
        super.update(elapsed);
        this.light.transform.setPosition([0, 3 + Math.sin(Date.now()*0.005)*0.1, 0]);
    }
}