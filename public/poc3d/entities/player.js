'use strict'

class Player extends Entity {
    #goto = undefined;
    constructor(local_position) {
        super(null, local_position);
        this.base = new Base(this);
        this.body = new Body(this);
        this.head = new Head(this);
        this.camera = new TrackingCamera(this, [0, 10, 6]);
        this.movement_speed = 0.003;
    }

    goto(point) {
        this.#goto = {
            start_point: this.getWorldPosition(),
            target: point,
            time: 0,
            duration: vec3.dist(this.getWorldPosition(), point)/this.movement_speed
        };
        var target_vector = vec3.create();
        vec3.sub(target_vector, point, position(this.getWorldTransform()));
        var forward_vector = forward(this.base.getWorldTransform());
        var angle = getHorizontalAngle(target_vector, forward_vector);
        
        this.base.local_transform.yaw(rad2deg(angle));
    }

    update(elapsed, dirty) {
        if (this.#goto) {
            var t = this.#goto.time/this.#goto.duration;
            this.#goto.time += elapsed;
            var new_location = vec3.create();
            vec3.lerp(new_location, this.#goto.start_point, this.#goto.target, t);
            this.local_transform.setPosition(new_location);
            if(t >= 0.999) {
                this.#goto = undefined; // Finished
            }
            dirty = true;
        }
        super.update(elapsed, dirty);
    }
}

class BodyLamp extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.body_lamp);
        this.material = materials.red_led;
    }
}
class HeadLamp extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.head_lamp);
        this.material = materials.red_led;
    }
}

class Base extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.crawlers);
        this.material = materials.player;
    }
}

class Body extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.body);
        this.material = materials.player;
        this.lamp = new BodyLamp(this);
    }
}

class Head extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.head);
        this.material = materials.player;
        this.lamp = new HeadLamp(this);
    }

    update(elapsed, dirty) {
        super.update(elapsed, dirty);

        var target_vector = vec3.create();
        vec3.sub(target_vector, this.parent.camera.pointing_at, position(this.getWorldTransform()));
        var forward_vector = forward(this.getWorldTransform());
        var angle = getHorizontalAngle(target_vector, forward_vector);
        
        this.local_transform.yaw(rad2deg(angle));
    }
}