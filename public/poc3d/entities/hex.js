'use strict';

class Hex extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.hex);
        this.material = materials.dirt;
    }
}