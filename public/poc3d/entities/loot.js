'use strict'

class Loot extends Pickable {
    constructor(position, item) {
        super(null, [position[0] + Math.random() - 0.5, position[1], position[2] + Math.random() - 0.5]);
        this.drawable = new Drawable(this, [0, 0, 0], models.sphere);
        this.drawable.material = materials.red_led;
        this.drawable.id = this.id;
        this.item = item;
        game.scene.entities.push(this);
    }

    interact() {
        player.inventory.push(this.item);
        game.scene.entities.splice(game.scene.entities.lastIndexOf(this), 1);
    }

    draw(renderer) {
        super.draw(renderer);
        if (alt_pressed || selected_id == this.id) {
            renderer.add_textbox({pos: this.getWorldPosition(), text: this.item.name});
        }
    }
}