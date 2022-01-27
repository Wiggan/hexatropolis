'use strict'

class Rocket extends Drawable {
    constructor(position, yaw, instigator) {
        //console.log(yaw);
        super(null, position);
        this.local_transform.yaw(yaw);
        this.model = models.sphere;
        this.material = materials.metall;
        this.fire = new Fire(this, [0, 0, 0]);
        //console.log(this.velocity);
        this.fire.local_transform.setPitch(-90);
        this.elapsed = 0;
        this.stats = {
            life_time: 1000,
            speed: 0.01
        }
        this.velocity = forward(this.local_transform.get());
        vec3.scale(this.velocity, this.velocity, this.stats.speed);
        this.instigator = instigator;
        this.collider.type = CollisionTypes.Projectile;
        this.collider.radius = 0.1;
        scene.entities.push(this);
        this.dmg = 20;
    }

    update(elapsed, dirty) {
        if (this.elapsed > this.stats.life_time) {
            this.explode();
        }
        this.elapsed += elapsed;
        super.update(elapsed, true);
    }

    explode() {
        scene.entities.splice(scene.entities.lastIndexOf(this), 1);
    }

    onCollision(other) {
        if (other != this.instigator) {
            this.explode();
            if (other.collider.type == CollisionTypes.Actor) {
                other.takeDamage(this.dmg);
            }
        }
    }
}