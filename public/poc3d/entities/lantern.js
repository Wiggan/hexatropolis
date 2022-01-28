'use strict';


class Lantern extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.lantern);
        this.light = new FloatingLightBulb(this, [0,1,0]);
        this.collider.type = CollisionTypes.Level;
        this.collider.radius = 0.2;
        this.material = materials.dirt;
    }
}