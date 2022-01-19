'use strict'

class Player extends Entity {
    constructor(local_position) {
        super(null, local_position);
        this.base = new Base(this, [0, 0, 0]);
        this.body = new Body(this, [0, 0, 0]);
        this.head = new Head(this, [0, 0, 0]);
        this.camera = new TrackingCamera(this, [0, 14, 4]);
        this.local_transform.scale(0.3);
        this.goto_target = local_position;
        this.movement_speed = 0.001;
    }

    goto(point) {
        this.goto_start_point = this.getWorldPosition();
        this.goto_target = point;
        this.goto_time = 0;
        this.goto_duration = vec3.dist(this.goto_start_point, this.goto_target)/this.movement_speed;
    }

    update(elapsed, dirty) {
        if (vec3.dist(this.getWorldPosition(), this.goto_target) > 0.1) {
            this.goto_time += elapsed;
            var new_location = vec3.create();
            vec3.lerp(new_location, this.getWorldPosition(), this.goto_target, this.goto_time/this.goto_duration);
            this.local_transform.setPosition(new_location);
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
        super.update(elapsed, true);

        var target_vector = vec3.create();
        vec3.sub(target_vector, this.parent.camera.pointing_at, position(this.getWorldTransform()));
        var forward_vector = forward(this.getWorldTransform());
        var angle = getHorizontalAngle(target_vector, forward_vector);
        
        console.log("Angle: " + angle);
        this.local_transform.yaw(rad2deg(angle));
    }

    draw2(renderer) {
        var target_vector = vec3.create();
        vec3.copy(target_vector, this.parent.camera.pointing_at);
        //vec3.transformMat4(target_vector, target_vector, this.parent.getWorldTransform());
        vec3.sub(target_vector, this.parent.camera.pointing_at, position(this.getWorldTransform()));
        var forward_vector = forward(this.getWorldTransform());
        target_vector[1] = 0;
        forward_vector[1] = 0;
        vec3.normalize(target_vector, target_vector);
        vec3.normalize(forward_vector, forward_vector);
        //var angle = vec3.angle(forward_vector, target_vector);
        var angle = getHorizontalAngle(forward_vector, target_vector);
        console.log("Angle: " + angle);

        var target_matrix = mat4.create();
        mat4.fromTranslation(target_matrix,target_vector);
        renderer.add_drawable(models.sphere, materials.light, target_matrix);

        vec3.rotateY(forward_vector, forward_vector, [0, 0, 0], -angle);
        vec3.scale(forward_vector, forward_vector, 1);
        var forward_matrix = mat4.create();
        mat4.fromTranslation(forward_matrix, forward_vector);
        renderer.add_drawable(models.sphere, materials.light, forward_matrix);

        super.draw(renderer);
    }
}