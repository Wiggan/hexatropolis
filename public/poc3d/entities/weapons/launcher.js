'use strict'

class Launcher extends Drawable {
    constructor(parent) {
        super(parent, [0.4,0.8,0], models.robot.rocket_launcher);
        this.material = materials.player;
        this.lamp = new Drawable(this, [0, 0, 0], models.robot.rocket_launcher_lamp);
        this.lamp.material = materials.green_led;
        this.stats = {
            damage: 1,
            cooldown: 500
        }
        this.cooldown = 0;
    }

    fire(point) {
        if (this.cooldown == 0) {
            new Rocket(this.getWorldPosition(), point, player);
            this.cooldown = this.stats.cooldown;
            this.lamp.material = materials.red_led;
        }
    }

    update(elapsed, dirty) {
        this.cooldown = Math.max(0, this.cooldown - elapsed);
        if (this.cooldown == 0) {
            this.lamp.material = materials.green_led;
        }
        super.update(elapsed, dirty);
    }
}
