'use strict';


class Lantern extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.lantern);
        this.light = new FloatingLightBulb(this, [0,4,0]);
    }
}