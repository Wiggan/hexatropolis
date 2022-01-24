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
        for (var i = 0; i < 10; i++) {
            new FireBlock(this, [0, 0.5, 0]);
        }
        this.local_transform.yaw(Math.random()*360);
    }

    update(elapsed, dirty) {
        var pos = vec3.create();
        vec3.add(pos, this.getLocalPosition(), [0, Math.sin(Date.now()*0.005)*0.005, 0]);
        this.local_transform.setPosition(pos);
        super.update(elapsed, dirty);
    }
}

const FireColors = {
    Start: [1.0, 0.0, 0.0],
    Stop: [1.0, 0.6, 0.0]
};

class FireBlock extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.block);
        this.original_position = local_position;
        this.material = {
            ambient: [1.0, 1.0, 1.0],
            specular: [1.0, 1.0, 1.0],
            diffuse: vec3.clone(FireColors.Start),
            shininess: 1,
            isLight: true
        }
        this.reset();
    }
    
    reset() {
        this.life_time = 400 + Math.random()*200;
        this.velocity = vec3.fromValues(Math.random() - 0.5, Math.random() - 1.5, Math.random() - 0.5);
        vec3.scale(this.velocity, this.velocity, 0.001);
        this.scale = 0.1;
        this.local_transform.setPosition(this.original_position);
        this.elapsed = 0;
        this.material.diffuse = vec3.clone(FireColors.Start);
    }

    update(elapsed, dirty) {
        if (this.elapsed > this.life_time) {
            this.reset();
        }
        this.elapsed += elapsed;
        vec3.lerp(this.material.diffuse, FireColors.Start, FireColors.Stop, this.elapsed/this.life_time);
        //console.log(this.material.diffuse);
        this.local_transform.scale(0.1 - 0.1 * this.elapsed / this.life_time);
        var translation = vec3.clone(this.velocity);
        vec3.scale(translation, translation, elapsed);
        this.local_transform.translate(translation);
        super.update(elapsed, true);
    }
}