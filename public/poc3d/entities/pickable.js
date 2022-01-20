'use strict';

const pickable_map = new Map();
var last_added_id = 1;
function getNextPickableId() {
    while(pickable_map.has(last_added_id)) {
        last_added_id++;
    }
    return last_added_id;
}
var selected_id = 0;

class Pickable extends Drawable {
    constructor(parent, local_position, model) {
        super(parent, local_position, model);
        this.model = model;
        this.material = materials.wall;
        this.id = getNextPickableId();
        pickable_map.set(this.id, this);
    }

    draw(renderer) {
        renderer.add_drawable(this.model, this.material, this.getWorldTransform(), this.id);
        super.draw(renderer);
    }
}