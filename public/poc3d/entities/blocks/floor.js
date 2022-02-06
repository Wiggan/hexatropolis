'use strict';

class Floor extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.hex);
        this.local_position = local_position;
        this.material = materials.dirt;
        this.local_transform.yaw(Math.floor(Math.random()*6)*60);
        if (Math.random() < 0.5) {
            this.local_transform.roll(180);
            this.local_transform.translate([0, -4, 0]);
        }
    }
    
    toJSON(key) {
        return {
            class: 'Floor',
            uuid: this.uuid,
            local_position: this.local_position
        }
    }
}

classes.Floor = Floor;