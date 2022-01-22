'use strict';

const States = {
    Active: 'Active',
    ShuttingDown: 'ShuttingDown',
    Inactive: 'Inactive',
    FiringUp: 'FiringUp'
};

class Prism extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.prism);
        this.material = materials.light;
        this.local_transform.scale(0.3);
    }
}

class FloatingLightBulb extends PointLight {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.prism = new Prism(this, [0, 0, 0]);
        this.position = [0, 1.5, 0];
        this.state = States.Inactive;
        this.elapsed = 0;
    }

    update(elapsed, dirty) {
        switch (this.state) {
            case States.Active:
                this.elapsed += elapsed;
                var pos = vec3.create();
                vec3.add(pos, this.position, [0,  + Math.sin(this.elapsed*0.005)*0.1, 0]);
                this.local_transform.setPosition(pos);
                this.local_transform.yaw(elapsed * 0.05);
                dirty = true;
                break;
            case States.Inactive:
                this.local_transform.setPosition(this.position);
                this.elapsed = 0;
                break;
            case States.FiringUp:
            case States.ShuttingDown:
                this.local_transform.setPosition(this.position);
                this.local_transform.yaw(elapsed * 0.05);
                this.transition.update(elapsed);
                break;
        }

        super.update(elapsed, dirty);
    }
    
    activate() {
        if (this.state == States.Inactive) {
            this.state = States.FiringUp;
            this.active = true;
            this.transition = new Transition(this,
                {state: this.state, active: true, position: this.getLocalPosition(), diffuse: [0, 0, 0], ambient: [0, 0, 0]},
                {state: States.Active, active: true, position: [0, 2.0, 0], diffuse: [0.2, 0.2, 0.6], ambient: [0.2, 0.2, 0.3]},
                1000);
        }
    }

    inactivate() {
        if (this.state == States.Active) {
            this.state = States.ShuttingDown;
            this.transition = new Transition(this,
                {state: this.state, active: true, position: this.getLocalPosition(), diffuse: [0.2, 0.2, 0.6], ambient: [0.2, 0.2, 0.3]},
                {state: States.Inactive, active: false, position: [0, 1.5, 0], diffuse: [0, 0, 0], ambient: [0, 0, 0]},
                1000);
        }

    }
}