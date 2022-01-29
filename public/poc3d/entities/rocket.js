'use strict'

class Rocket extends Drawable {
    constructor(position, point, speed, instigator) {
        super(null, position);
        //this.local_transform.yaw(yaw);
        this.lookAtInstantly(point);
        this.model = models.sphere;
        this.material = materials.metall;
        this.fire = new Fire(this, [0, 0, 0]);
        //console.log(this.velocity);
        //this.fire.local_transform.setPitch(-90);
        this.elapsed = 0;
        this.stats = {
            life_time: 1000,
            speed: speed
        }
        this.velocity = forward(this.local_transform.get());
        vec3.scale(this.velocity, this.velocity, this.stats.speed);
        this.instigator = instigator;
        this.collider.type = CollisionTypes.Projectile;
        this.collider.radius = 0.1;
        scene.entities.push(this);
        this.dmg = 20;
        this.sound = getRandomElement(sfx.rocket_flying).cloneNode();
        this.sound.play();
    }

    update(elapsed, dirty) {
        if (this.elapsed > this.stats.life_time) {
            this.explode();
        }
        this.elapsed += elapsed;
        super.update(elapsed, true);
    }

    explode() {
        scene.remove(this);
        var direction = vec3.clone(this.velocity);
        vec3.scale(direction, direction, -1);
        vec3.normalize(direction, direction);
        scene.entities.push(new FirePuff(null, this.getWorldPosition(), direction));
        scene.entities.push(new Smoke(null, this.getWorldPosition()));
        this.sound.pause();
        this.sound.currentTime = 0;
        getRandomElement(sfx.rocket_exploding).cloneNode().play();
    }

    onCollision(other) {
        if (other != this.instigator && other.collider.type != CollisionTypes.Projectile) {
            this.explode();
            if (other.collider.type == CollisionTypes.Actor) {
                other.takeDamage(this.dmg);
            }
        }
    }
}