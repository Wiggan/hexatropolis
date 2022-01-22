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

class Pickable extends Entity {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.id = getNextPickableId();
        pickable_map.set(this.id, this);
    }

    make_unpickable() {
        pickable_map.delete(this.id);
        this.id = undefined;
    }
}