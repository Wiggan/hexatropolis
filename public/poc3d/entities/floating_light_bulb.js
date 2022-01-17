'use strict';

class FloatingLightBulb extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.model = models.block;
        this.transform.pitch(45);
        this.transform.yaw(45);
        this.transform.roll(45);
        this.transform.scale(0.3);
        this.light = new PointLight(this, [0,0,0]);
        this.light.diffuse = [0.2, 0.2, 0.6];
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }
}