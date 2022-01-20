'use strict'

class Player extends Entity {
    #goto = undefined;
    constructor(local_position) {
        super(null, local_position);
        this.base = new Base(this, [0, 0, 0]);
        this.body = new Body(this, [0, 0, 0]);
        this.head = new Head(this, [0, 0, 0]);
        this.camera = new TrackingCamera(this, [0, 14, 4]);
        this.local_transform.scale(0.3);
        this.movement_speed = 0.001;
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

class Base extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.crawlers);
    }
}

class Body extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.body);
    }
}

class Head extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.head);
        this.local_transform.setYaw(0);
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