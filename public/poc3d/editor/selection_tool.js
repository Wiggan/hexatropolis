'use strict'

class SelectionTool extends Tool {
    constructor() {
        super();
    }

    onKeyDown(e) {
        super.onKeyDown(e);
    }
    
    onKeyUp(e) {
        super.onKeyUp(e);
    }

    onmousedown(e, clicked_entity) {
        super.onmousedown(e, clicked_entity);
    }
    
    onmouseup(e, clicked_entity) {
        super.onmouseup(e, clicked_entity);
        // Connect trigger
        
        if (e.button == 0) {
            if (e.shiftKey && e.ctrlKey) {
                if (selected_entities.length == 1) {
                    if (selected_entities[0].collider.type == CollisionTypes.Trigger && clicked_entity.trigger) {
                        console.log("Connected trigger and triggee");
                        selected_entities[0].triggee = clicked_entity.uuid;
                    }
                }
            } else {
                if (!e.shiftKey) {
                    selected_entities.length = 0;
                }
                if (this.clicked_entity_start == clicked_entity) {
                    this.selectEntity(clicked_entity);
                } else {
                    var entities = game.scene.entities.filter(entity => this.isEntityInsideRectangle(this.click_start, this.click_end, entity));
                    entities.forEach(entity => this.selectEntity(entity));
                }
            }
        } else if (e.button == 2) {
            this.deselectEntity(clicked_entity);
        }
    }

    setPosition(position) {
        this.local_transform.setPosition(position);
        this.update(0, true);
    }

    draw(renderer) {
        selected_entities.forEach(entity => {
            this.drawSelected(renderer, entity);
        });
    }
}