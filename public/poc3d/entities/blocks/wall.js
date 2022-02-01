'use strict';

class Wall extends Drawable {
    constructor(parent, local_position) {
        super(parent, [local_position[0], 3, local_position[2]], models.hex);
        this.local_position = local_position;
        this.material = materials.dirt;
        this.collider.type = CollisionTypes.Level;
        this.local_transform.yaw(Math.floor(Math.random()*6)*60);
        if (Math.random() < 0.5) {
            this.local_transform.roll(180);
            this.local_transform.translate([0, -4, 0]);
        }
    }

    
    toJSON(key) {
        return {
            type: 'Wall',
            local_position: this.local_position
        }
    }
}


classes.Wall = Wall;