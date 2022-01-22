'use strict';

class Chest extends Pickable {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.side1 = new ChestSide(this, [0, 0, -0.25], this.id);
        this.side2 = new ChestSide(this, [-0.25, 0, 0], this.id);
        this.side3 = new ChestSide(this, [0, 0, 0.25], this.id);
        this.side4 = new ChestSide(this, [0.25, 0, 0], this.id);
        this.side2.local_transform.yaw(90);
        this.side3.local_transform.yaw(180);
        this.side4.local_transform.yaw(-90);
    }

    onClick() {
        this.children.forEach(side => {
            side.open();
            side.id = undefined;
            side.light.id = undefined;
        });
        this.make_unpickable();
    }
}

class ChestSide extends Drawable {
    constructor(parent, local_position, id) {
        super(parent, local_position, models.chest.side);
        this.material = materials.metall;
        this.light = new ChestLamp(this, [0, 0, 0], id);
        this.id = id;
        this.opening = false;
        this.pitch = 0;
    }

    open() {
        this.opening = true;
        this.transition = new Transition(this, {pitch: 0, opening: true}, {pitch: -104, opening: false}, 1000);
    }

    update(elapsed, dirty) {
        if (this.opening) {
            this.transition.update(elapsed);
            this.local_transform.setPitch(this.pitch);
            dirty = true;
        }
        super.update(elapsed, dirty);
    }
}

class ChestLamp extends Drawable {
    constructor(parent, local_position, id) {
        super(parent, local_position, models.chest.side_lamp);
        this.material = materials.green_led;
        this.id = id;
    }
}