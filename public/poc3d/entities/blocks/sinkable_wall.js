'use strict';

class SinkableWall extends Drawable {
    constructor(parent, local_position) {
        super(parent, [local_position[0], 3, local_position[2]], models.hex);
        this.local_position = local_position;
        this.material = materials.dirt;
        this.collider.type = CollisionTypes.Level;
        this.local_transform.yaw(Math.floor(Math.random()*6)*60);
        this.position = [local_position[0], 3, local_position[2]];
    }

    trigger() {
        this.transition = new Transition(this, [{
            time: 50000, to: {
                position: [this.local_position[0], 0, this.local_position[2]],
                collider: {type: CollisionTypes.NoCollision}}
        }]);
    }
    
    toJSON(key) {
        return {
            class: 'SinkableWall',
            uuid: this.uuid,
            local_position: this.local_position
        }
    }
    
    update(elapsed, dirty) {
        if (this.transition) {
            this.transition.update(elapsed);
            this.local_transform.setPosition(this.position);
            dirty = true;
        }
        super.update(elapsed, dirty);
    }
}


classes.SinkableWall = SinkableWall;