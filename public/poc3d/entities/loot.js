'use strict'

class Loot extends Pickable {
    constructor(position, item) {
        super(null, position);
        this.drawable = new Drawable(this, [0, 0, 0], models.sphere);
        this.drawable.material = materials.red_led;
        this.drawable.id = this.id;
        this.item = item;
        scene.entities.push(this);
    }

    onClick() {
        player.inventory.push(this.item);
        scene.entities.splice(scene.entities.lastIndexOf(this), 1);
    }
}