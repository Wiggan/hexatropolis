'use strict'

class Launcher extends Drawable {
    constructor(parent) {
        super(parent, [0.4,0.8,0], models.weapon.launcher.launcher);
        this.material = materials.player;
        this.lamp = new Drawable(this, [0, 0, 0], models.weapon.launcher.launcher_lamp);
        this.lamp.material = materials.green_led;
        this.stats = {
            damage: 1,
            cooldown: 500
        }
        this.cooldown = 0;
    }

    fire(point) {
        if (this.cooldown == 0) {
            var pos = this.getWorldPosition();
            var f = forward(this.getWorldTransform());
            vec3.scale(f, f, 0.5);
            vec3.add(pos, pos, f);

            new Rocket(pos, point, 0.01, player);
            this.cooldown = this.stats.cooldown;
            this.lamp.material = materials.red_led;
            this.sound = getRandomElement(sfx.launch).play();
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
