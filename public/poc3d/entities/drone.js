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
        this.local_transform.yaw(Math.random()*360);
        this.fire = new Fire(this, [0, 0.5, 0]);
    }

    update(elapsed, dirty) {
        var pos = vec3.create();
        vec3.add(pos, this.getLocalPosition(), [0, Math.sin(Date.now()*0.005)*0.005, 0]);
        this.local_transform.setPosition(pos);
        super.update(elapsed, dirty);
    }
}