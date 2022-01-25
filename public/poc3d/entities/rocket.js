'use strict'

class Rocket extends Drawable {
    constructor(position, yaw) {
        super(null, position);
        this.local_transform.yaw(yaw);
        this.model = models.sphere;
        this.material = materials.metall;
        this.fire = new Fire(this, [0, 0, 0]);
        this.fire.local_transform.setPitch(90);
        this.velocity = forward(this.getWorldTransform());
        this.elapsed = 0;
        this.stats = {
            life_time: 1000,
            speed: 0.01
        }
        scene.entities.push(this);
    }

    update(elapsed, dirty) {
        if (this.elapsed > this.stats.life_time) {        
            scene.entities.splice(scene.entities.lastIndexOf(this), 1);
        }
        this.elapsed += elapsed;
        var translation = vec3.clone(this.velocity);
        vec3.scale(translation, translation, elapsed * this.stats.speed);
        this.local_transform.translate(translation);
        super.update(elapsed, true);
    }
}