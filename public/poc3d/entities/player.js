'use strict'

const PlayerState = {
    GotoInteractible: 'GotoInteractible',
    Goto: 'Goto',
    Idle: 'Idle',
    Attack: 'Attack',
    Firing: 'Firing'
}

class Player extends Entity {
    constructor(local_position) {
        super(null, local_position);
        this.models = {
            base: new Base(this),
            body: new Body(this),
            head: new Head(this)
        };
        this.camera = new TrackingCamera(this, [0, 8, 4]);
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
        this.state_context = {
            position: [local_position[0], local_position[1], local_position[2] - 1]
        };
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
        if (this.state != PlayerState.Firing) {
            this.models.body.right_arm.fire(point);
        }
    }

    update(elapsed, dirty) {
        switch (this.state) {
            case PlayerState.GotoInteractible:
                if(vec3.dist(this.state_context.position, this.getWorldPosition()) < this.state_context.tolerance) {
                    if (this.state_context.target.type == PickableType.Enemy) {
                        this.state = PlayerState.Attack;
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
            case PlayerState.Firing:
                dirty = true;

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
    }

    update(elapsed, dirty) {
        if (this.parent.state == PlayerState.Goto || this.parent.state == PlayerState.GotoInteractible) {
            this.look_at = this.parent.state_context.position;
        } else {
            this.look_at = undefined;
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
        this.right_arm = new RocketLauncher(this);
        this.rotation_speed = 1;
    }

    update(elapsed, dirty) {
        if (this.parent.state != PlayerState.Idle) {
            this.look_at = this.parent.state_context.position;
        } else {
            this.look_at = undefined;
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
        this.look_at = this.parent.camera.pointing_at;
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


class RocketLauncher extends Drawable {
    constructor(parent) {
        super(parent, [0.4,0.8,0], models.robot.rocket_launcher);
        this.material = materials.player;
        this.lamp = new Drawable(this, [0, 0, 0], models.robot.rocket_launcher_lamp);
        this.lamp.material = materials.green_led;
        this.stats = {
            damage: 1,
            attack_duration: 500
        }
        this.time = 0;
    }

    fire(point) {
        var start = this.getWorldPosition();
        var target_vector = vec3.create();
        vec3.sub(target_vector, point, player.getWorldPosition());
        var forward_vector = forward(player.getWorldTransform());
        var angle = rad2deg(getHorizontalAngle(target_vector, forward_vector));
        player.state_context.position = point;
        new Rocket(start, angle);
        console.log("start: " + start);
        player.state = PlayerState.Firing;
        this.lamp.material = materials.red_led;
    }

    update(elapsed, dirty) {
        if (player.state == PlayerState.Firing) {
            this.time += elapsed;
            if (this.time >= this.stats.attack_duration) {
                player.state = PlayerState.Idle;
                this.time = 0;
                this.lamp.material = materials.green_led;
            }
            dirty = true;
        }
        super.update(elapsed, dirty);
    }
}
