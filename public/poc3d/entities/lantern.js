'use strict';

class Lantern extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.light = new FloatingLightBulb(this, [0,3,0]);
        this.model = models.lantern;
        this.active = true;
        this.light.transform.yaw(Math.random()*2*Math.PI);
        this.float_offset = Math.random()*2*Math.PI;
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }

    update(elapsed) {
        super.update(elapsed);
        if (this.active) {
            this.light.transform.setPosition([0, 3 + Math.sin(Date.now()*0.005 + this.float_offset)*0.1, 0]);
            this.light.transform.yaw(elapsed * 0.05);
        }
    }
}