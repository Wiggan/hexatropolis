'use strict'

const PlayerState = {
    GotoInteractible: 'GotoInteractible',
    Goto: 'Goto',
    Idle: 'Idle',
    Attack: 'Attack'
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
            attack_range: 1
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
            this.state = PlayerState.GotoInteractible;
            this.state_context = {
                target: object,
                position: object.getWorldPosition(),
                tolerance: this.stats.pickup_range
            };
        }
    }

    right_click(point, object) {
        new Rocket(vec3.fromValues(point[0], 1, point[2]), getHorizontalAngle(this.getWorldPosition(), point));
    }
    
    attack(object) {

    }

    update(elapsed, dirty) {
        switch (this.state) {
            case PlayerState.GotoInteractible:
                if(vec3.dist(this.state_context.position, this.getWorldPosition()) < this.state_context.tolerance) {
                    if (this.state_context.target.type == PickableType.Enemy) {
                        this.state = PlayerState.Attack;
                        this.attack(this.state_context.target);
                    } else {
                        this.state = PlayerState.Idle;
                        this.state_context.target.interact();
                    }
                } else {
                    var forward_vector = forward(this.models.base.getWorldTransform());
                    var movement = vec3.create();
                    vec3.scale(movement, forward_vector, elapsed * this.stats.movement_speed);
                    this.local_transform.translate(movement);
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
            case PlayerState.Attack:

                break;
        }
        super.update(elapsed, dirty);
    }
}

class BodyLamp extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.body_lamp);
        this.material = materials.green_led;
    }
}

class HeadLamp extends Drawable {
    constructor(parent) {
        super(parent, [0,0,0], models.robot.head_lamp);
        this.material = materials.green_led;
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
        this.left_arm = new Wrench(this);
        this.stats = {
            turning_speed: 1
        }
    }

    update(elapsed, dirty) {
        if (this.parent.state == PlayerState.Goto || this.parent.state == PlayerState.GotoInteractible || this.parent.state == PlayerState.Attack) {
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

class Wrench extends Drawable {
    constructor(parent) {
        super(parent, [-0.4,0.8,0], models.robot.wrench);
        this.material = materials.player;
        this.stats = {
            damage: 1,
            attack_duration: 100
        }
        this.time = 0;
    }
    
    update(elapsed, dirty) {
        if (player.state == PlayerState.Attack) {
            this.local_transform.pitch(-90/this.stats.attack_duration*elapsed);
            this.time += elapsed;
            if (this.time >= this.stats.attack_duration) {
                player.state = PlayerState.Idle;
                this.local_transform.setPitch(0);
                this.time = 0;
            }
        }
        super.update(elapsed, dirty);
    }
}