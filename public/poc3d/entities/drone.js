'use strict'

class Drone extends Pickable {
    constructor(position) {
        super(null, position);
        this.type = PickableType.Enemy;
        this.body = new Drawable(this, [0, 0, 0], models.drone.body);
        this.lamp = new Drawable(this, [0, 0, 0], models.drone.lamp);
        this.lamp.material = materials.red_led;
        this.lamp.id = this.id;
        this.body.material = materials.player;
        this.body.id = this.id;
    }

    update(elapsed, dirty) {
        var pos = vec3.create();
        vec3.add(pos, this.getLocalPosition(), [0, Math.sin(Date.now()*0.005)*0.003, 0]);
        this.local_transform.setPosition(pos);
        super.update(elapsed, dirty);
    }
}