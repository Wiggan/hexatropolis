'use strict';

class FloatingLightBulb extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.prism);
        this.material = materials.light;
        this.transform.scale(0.3);
        this.light = new PointLight(this, [0,0,0]);
        this.light.diffuse = [0.2, 0.2, 0.6];
        this.active = true;
        this.transform.yaw(Math.random()*2*Math.PI);
        this.float_offset = Math.random()*2*Math.PI;
        this.active_height = 2;
    }

    update(elapsed) {
        super.update(elapsed);
        if (this.active) {
            this.transform.setPosition([0, this.active_height + Math.sin(Date.now()*0.005 + this.float_offset)*0.1, 0]);
            this.transform.yaw(elapsed * 0.05);
        }
    }
}