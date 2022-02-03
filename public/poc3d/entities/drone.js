'use strict'

class Drone extends Pickable {
    constructor(parent, position) {
        super(null, position);
        this.position = position;
        this.type = PickableType.Enemy;
        this.body = new Drawable(this, [0, 0, 0], models.drone.body);
        this.lamp = new Drawable(this, [0, 0, 0], models.drone.lamp);
        this.lamp.material = materials.red_led;
        this.lamp.id = this.id;
        this.body.material = materials.player;
        this.body.id = this.id;
        this.local_transform.yaw(Math.random()*360);
        this.fire = new Fire(this, [0, 0.5, 0]);
        this.collider.type = CollisionTypes.Actor;
        this.collider.radius = 0.4;
        this.name = "Drone";
        this.max_health = 50;
        this.health = 50;
    }
    
    toJSON(key) {
        return {
            class: 'Drone',
            local_position: this.position
        }
    }


    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health == 0) {
            game.scene.remove(this);
            game.scene.entities.push(new FirePuff(null, this.getWorldPosition(), [0, 1, 0]));
            game.scene.entities.push(new Smoke(null, this.getWorldPosition()));
        }
    }

    update(elapsed, dirty) {
        var pos = vec3.create();
        vec3.add(pos, this.getLocalPosition(), [0, Math.sin(Date.now()*0.005)*0.005, 0]);
        this.local_transform.setPosition(pos);
        super.update(elapsed, dirty);
    }
}


classes.Drone = Drone;