'use strict';

class Chest extends Pickable {
    constructor(parent, local_position) {
        super(null, local_position);
        this.local_position = local_position;
        this.side1 = new ChestSide(this, [0, 0, -0.25], this.id);
        this.side2 = new ChestSide(this, [-0.25, 0, 0], this.id);
        this.side3 = new ChestSide(this, [0, 0, 0.25], this.id);
        this.side4 = new ChestSide(this, [0.25, 0, 0], this.id);
        this.side2.local_transform.yaw(90);
        this.side3.local_transform.yaw(180);
        this.side4.local_transform.yaw(-90);
        this.max_drop = 3;
        this.level = 5;
    }

    toJSON(key) {
        return {
            class: 'Chest',
            local_position: this.local_position
        }
    }

    interact() {
        this.children.forEach(side => {
            side.open();
            side.id = undefined;
            side.light.id = undefined;
        });
        this.make_unpickable();
        drop(this);
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
        this.position = local_position;
        this.lamp_material = materials.green_led;
    }

    open() {
        this.opening = true;
        var end_position = [this.position[0], this.position[1] -0.1, this.position[2]];
        this.transition = new Transition(this, [
            {time: 1000, to: {pitch: -104, lamp_material: materials.red_led}},
            {time: 1000, to: {position: end_position, opening: false}}
        ]);
    }

    update(elapsed, dirty) {
        if (this.opening) {
            this.transition.update(elapsed);
            this.local_transform.setPitch(this.pitch);
            this.local_transform.setPosition(this.position);
            dirty = true;
        }
        super.update(elapsed, dirty);
    }
}

class ChestLamp extends Drawable {
    constructor(parent, local_position, id) {
        super(parent, local_position, models.chest.side_lamp);
        this.id = id;
    }

    draw(renderer) {
        this.material = this.parent.lamp_material;
        super.draw(renderer);
    }
}

classes.Chest = Chest;