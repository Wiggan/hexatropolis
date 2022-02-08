'use strict'

class EditorCamera extends Camera {
    constructor(local_position, scene) {
        super(null, local_position);
        this.original_position = local_position;
        this.local_transform.pitch(-90);
        this.x = 10;
        this.y = 10;
        this.velocity = [0, 0, 0];
        this.wheel = 0;
        this.pointer_entity = new Entity(null, [0,0,0]);
        
        this.dynamics = [
            new Drone(null, [0, 0, 0]),
            new Chest(null, [0, 0, 0]),
        ];
        this.dynamics.forEach(dynamic => dynamic.material = materials.blue);
        this.dynamic_index = 0;

        this.tools = [
            new SelectionTool(),
            new BlockTool(scene)
        ]
        this.active_tool = this.tools[0];
    }

    toJSON(key) { 
        return {}; 
    }

    activate() {
        super.activate();
        document.addEventListener("mousemove", active_camera.updatePosition, false);
        document.addEventListener("wheel", active_camera.updateScroll, false);

    }
    
    deactivate() {
        document.removeEventListener("mousemove", active_camera.updatePosition, false);
        document.removeEventListener("wheel", active_camera.updateScroll, false);
    }

    updatePosition(e) {
        active_camera.x = e.clientX;
        active_camera.y = e.clientY;
    }

    updateScroll(e) {
        active_camera.local_transform.translate([0, e.wheelDeltaY/100, 0]);
        return false;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
        if (e.key == 'Alt') {
            alt_pressed = true;
            e.preventDefault();
        } else if (e.key == 'Control') {
            ctrl_pressed = true;
            e.preventDefault();
        } else if (e.key == 'w' || e.key == 'W') {
            this.velocity[2] = -0.005;
        } else if (e.key == 's' || e.key == 'S') {
            this.velocity[2] = 0.005;
        } else if ((e.key == 'a' || e.key == 'A') && !e.shiftKey) {
            this.velocity[0] = -0.005;
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0.005;
        } else if (e.key == ' ') {
            this.local_transform.setPosition(this.original_position);
        } else if (e.key == '1') {
            this.active_tool = this.tools[0];
        } else if (e.key == '2') {
            this.active_tool = this.tools[1];
        } else if (e.key == '3') {
            this.active_tool = this.tools[2];
        } 
        this.active_tool.onKeyDown(e);
    }
    
    changeDynamic(delta) {
        var dynamic_index = (this.dynamic_index + delta) % this.dynamics.length;
        if (dynamic_index < 0) dynamic_index += this.dynamics.length;
        this.dynamic_index = dynamic_index;
        this.pointer_entity.removeAllChildren();
        this.pointer_entity.addChild(this.dynamics[this.dynamic_index]);
    }

    onKeyUp(e) {
        if (e.key == 'Alt') {
            alt_pressed = false;
            e.preventDefault();
        } else if (e.key == 'Control') {
            ctrl_pressed = false;
            e.preventDefault();
        } else if (e.key == 'w' || e.key == 'W') {
            this.velocity[2] = 0;
        } else if (e.key == 's' || e.key == 'S') {
            this.velocity[2] = 0;
        } else if (e.key == 'a' || e.key == 'A') {
            this.velocity[0] = 0;
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0;
        }
        this.active_tool.onKeyUp(e);
    }

    onmousedown(e) {
        this.active_tool.onmousedown(e, pickable_map.get(selected_id));
        /* 
        if (clicked_entity) {
            if (e.button == 0) {
                if (this.selected_tool == 3) {
                    
                    if (e.shiftKey && e.ctrlKey) {
                        if (selected_entities.length == 1) {
                            if (selected_entities[0].collider.type == CollisionTypes.Trigger && clicked_entity.trigger) {
                                console.log("Connected trigger and triggee");
                                selected_entities[0].triggee = clicked_entity.uuid;
                                //this.selectEntity(clicked_entity);
                            }
                        }
                    } else {
                        this.selection_start = clicked_entity;
                    }
                } else {
                    var new_entity;
                    if (this.selected_tool == 1) {
                        new_entity = new classes[this.blocks[this.block_index].toJSON().class](game.scene, this.pointer_entity.getWorldPosition());    
                    } else if (this.selected_tool == 2) {
                        new_entity = new classes[this.dynamics[this.dynamic_index].toJSON().class](game.scene, this.pointer_entity.getWorldPosition());    
                    }
                    if (!new_entity.id) {
                        new_entity.makePickable();
                    }
                    //this.selectEntity(new_entity);
                    game.scene.entities.push(new_entity);
                }
            } else if (e.button == 2) {
                if (this.selected_tool < 3) {
                    game.scene.remove(clicked_entity);
                } else if (this.selected_tool == 3) {
                    this.deselectEntity(clicked_entity);
                }
            }

        } */
        e.preventDefault();
    }

    onmouseup(e) {
        this.active_tool.onmouseup(e, pickable_map.get(selected_id));
/*         if (e.button == 0) {
            if (this.selected_tool == 3) {
                if (e.shiftKey && e.ctrlKey) {
                } else {
                    var selection_end = pickable_map.get(selected_id);
                    if (this.selection_start == selection_end) {
                        this.selectEntity(selection_end);
                    } else {
                        var entities = game.scene.entities.filter(entity => this.isEntityInsideRectangle(this.selection_start.getWorldPosition(), selection_end.getWorldPosition(), entity));
                        entities.forEach(entity => this.selectEntity(entity));
                    }
                }
            }
        } */
        e.preventDefault();
    } 

    onclick(e) {
        e.preventDefault();
    }

    update(elapsed, dirty) {
        var p1 = getScreenSpaceToWorldLocation([this.x, this.y, 0]);
        var p2 = getScreenSpaceToWorldLocation([this.x, this.y, 100]);
        var intersection = getHorizontalIntersection(p1, p2, 0);
        if (Number.isFinite(intersection[0]) && Number.isFinite(intersection[1]) && Number.isFinite(intersection[2])) {
            this.active_tool.setPosition(intersection);
        }
        this.active_tool.update(elapsed, dirty);
        super.update(elapsed, dirty);
    }

    draw(renderer) {
        this.active_tool.draw(renderer);
        if (!alt_pressed) {
            if (this.selected_tool == 1) {
                renderer.add_textbox({pos: this.pointer_entity.getWorldPosition(), text: this.blocks[this.block_index].toJSON().class});
            } else if (this.selected_tool == 2) {
                renderer.add_textbox({pos: this.pointer_entity.getWorldPosition(), text: this.dynamics[this.dynamic_index].toJSON().class});
            }
        }
        if (debug) {
            renderer.add_drawable(models.sphere, materials.light, this.pointer_entity.getWorldTransform());
            
        }
    }
}
