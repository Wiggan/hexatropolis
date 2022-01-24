'use strict'

const PlayerState = {
    GotoInteractible: 'GotoInteractible',
    Goto: 'Goto',
    Idle: 'Idle'
}

class Player extends Entity {
    constructor(local_position) {
        super(null, local_position);
        this.models = {
            base: new Base(this),
            body: new Body(this),
            head: new Head(this)
        };
        this.camera = new TrackingCamera(this, [0, 10, 6]);
        this.stats = {
            movement_speed: 0.003,
            pickup_range: 1,

        };
        this.inventory = [];
        this.equipment = {
            right_arm: undefined,
            left_arm: undefined,
        };
        this.state = PlayerState.Idle;
        this.state_context = {};
    }

    left_click(point, object) {
        if (object == undefined) {
            this.state = PlayerState.Goto;
            this.state_context = {
                position: point,
                tolerance: 0.05
            };
        } else {
            switch(object.type) {
                case PickableType.Default:
                    if (object.getDistanceToPlayer() < this.stats.pickup_range) {
                        object.on_click();
                    } else {
                        this.state = PlayerState.GotoInteractible;
                        this.state_context = {
                            target: object,
                            position: object.getWorldPosition(),
                            tolerance: this.stats.pickup_range
                        };
                    }
                    break;
                    case PickableType.Enemy:
                        
                        break;
                    }
                }
            }
            
    right_click(point, object) {
        
    }
    
    update(elapsed, dirty) {
        switch (this.state) {
            case PlayerState.GotoInteractible:
                var forward_vector = forward(this.models.base.getWorldTransform());
                var movement = vec3.create();
                vec3.scale(movement, forward_vector, elapsed * this.stats.movement_speed);
                this.local_transform.translate(movement);
                if(vec3.dist(this.state_context.position, this.getWorldPosition()) < this.state_context.tolerance) {
                    this.state_context.target.on_click();
                    this.state = PlayerState.Idle;
                }
                dirty = true;
                break;
            case PlayerState.Goto:
                var forward_vector = forward(this.models.base.getWorldTransform());
                var movement = vec3.create();
                vec3.scale(movement, forward_vector, elapsed * this.stats.movement_speed);
                this.local_transform.translate(movement);
                if(vec3.dist(this.state_context.position, this.getWorldPosition()) < this.state_context.tolerance) {
                    this.state = PlayerState.Idle;
                }
                dirty = true;
                break;
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
        this.stats = {
            turning_speed: 0.5
        }
    }

    update(elapsed, dirty) {
        if (this.parent.state == PlayerState.Goto || this.parent.state == PlayerState.GotoInteractible) {
            var target_vector = vec3.create();
            vec3.sub(target_vector, this.parent.state_context.position, position(this.parent.getWorldTransform()));
            var forward_vector = forward(this.getWorldTransform());
            var angle = rad2deg(getHorizontalAngle(target_vector, forward_vector));
            if (Math.abs(angle) > 0.005) {
                var angle_increment = Math.sign(angle) * Math.min(Math.abs(angle), this.stats.turning_speed * elapsed);
                this.local_transform.yaw(angle_increment)
                dirty = true;
            }
        }
        super.update(elapsed, dirty);
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