'use strict'

var selected_entities = [], selected_gui;

function snapToHexPosition(pos) {
    return indexToHexPosition(hexPositionToIndex(pos));
}

function indexToHexPosition(pos) {
    const size = 1;
    return [size * Math.sqrt(3) * (pos[0] + 0.5 * (pos[2]&1)),
        pos[1],
        size * 3/2 * pos[2]];
}

function hexPositionToIndex(pos) {
    const size = 1;
    var iz = Math.round(pos[2] / size * 2 / 3);
    var iy = 0;
    var ix = Math.round(pos[0] / size / Math.sqrt(3) -  0.5 * (iz&1));
    return [ix, iy, iz];
}

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
        this.blocks = [new Wall(null, [0,0,0]),
                       new Floor(null, [0,0,0]),
                       new Lantern(scene, [0,0,0]),
                       new Portal(scene, [0,0,0]),
                       new FloorButton(null, [0,0,0]),
                       new SinkableWall(null, [0,0,0]),
                    ];
        this.dynamics = [
            new Drone(null, [0, 0, 0]),
            new Chest(null, [0, 0, 0]),
        ];
        this.blocks.forEach(block => block.material = materials.blue);
        this.block_index = 0;
        this.dynamics.forEach(dynamic => dynamic.material = materials.blue);
        this.dynamic_index = 0;
        this.selected_tool = 3;
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
        } else if (e.key == 'a' || e.key == 'A') {
            if (e.shiftKey) {
                selected_entities.length = 0;
            } else {
                this.velocity[0] = -0.005;
            }
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0.005;
        } else if (e.key == ' ') {
            this.local_transform.setPosition(this.original_position);
        } else if (e.key == '1') {
               this.selected_tool = 1;
               this.pointer_entity.removeAllChildren();
               this.pointer_entity.addChild(this.blocks[this.block_index]);
               picking = false;
        } else if (e.key == '2') {
            this.selected_tool = 2;
            this.pointer_entity.removeAllChildren();
            this.pointer_entity.addChild(this.dynamics[this.dynamic_index]);
            picking = false;
        } else if (e.key == '3') {
            this.selected_tool = 3;
            this.pointer_entity.removeAllChildren();
            picking = true;
        } else if (e.key == 'ArrowUp') {
            if (this.selected_tool == 1) {
                this.changeBlock(1);
            } else if (this.selected_tool == 2) {
                this.changeDynamic(1);
            }
        } else if (e.key == 'ArrowDown') {
            if (this.selected_tool == 1) {
                this.changeBlock(-1);
            } else if (this.selected_tool == 2) {
                this.changeDynamic(-1);
            }
        }
    }


    
    changeDynamic(delta) {
        var dynamic_index = (this.dynamic_index + delta) % this.dynamics.length;
        if (dynamic_index < 0) dynamic_index += this.dynamics.length;
        this.dynamic_index = dynamic_index;
        this.pointer_entity.removeAllChildren();
        this.pointer_entity.addChild(this.dynamics[this.dynamic_index]);
    }

    changeBlock(delta) {
        var block_index = (this.block_index + delta) % this.blocks.length;
        if (block_index < 0) block_index += this.blocks.length;
        this.block_index = block_index;
        this.pointer_entity.removeAllChildren();
        this.pointer_entity.addChild(this.blocks[this.block_index]);
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
    }

    updateSelectedGui() {
        if (selected_gui) {
            gui.removeFolder(selected_gui);
        }
        selected_gui = gui.addFolder('Selected');
        if (selected_entities.length == 1) {
            var persistent = selected_entities[0].toJSON();
            Object.assign(selected_entities[0], persistent);
            for (const [key, value] of Object.entries(persistent)) {
                if (key == 'destination_scene_name') {
                    selected_gui.add(persistent, key, Object.keys(game.scenes)).onChange((v) => selected_entities[0][key] = v);
                } else if (key == 'uuid') {
                    selected_gui.add(persistent, key).onChange((v) => selected_entities[0][key] = v);
                } else if (key == 'triggee') {
                    selected_gui.add(persistent, key/*, game.scene.entities.filter(entity => entity.trigger)*/).listen().onChange((v) => {
                        selected_entities[0][key] = v;
                    });
                } else if (key == 'class') {
                    selected_gui.add(persistent, key).onChange((v) => selected_entities[0][key] = v);
                }
            }
        }
        selected_gui.open();
    }

    selectEntity(entity) {
        if (!selected_entities.includes(entity) && entity != this) {
            selected_entities.push(entity);
            this.updateSelectedGui();
        }
    }
    
    deselectEntity(entity) {
        selected_entities.splice(selected_entities.indexOf(entity), 1);
        this.updateSelectedGui();
    }

    onmousedown(e) {
        var clicked_entity = pickable_map.get(selected_id);
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

        }
        e.preventDefault();
    }
    onmouseup(e) {
        if (e.button == 0) {
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
        }
        e.preventDefault();
    } 

    onclick(e) {
        e.preventDefault();
    }

    isEntityInsideRectangle(pos1, pos2, entity) {
        var pos = entity.getWorldPosition();
        return pos1[0] <= pos[0] && pos[0] <= pos2[0] && pos1[2] <= pos[2] && pos[2] <= pos2[2];
    }

    update(elapsed, dirty) {
        var p1 = getScreenSpaceToWorldLocation([this.x, this.y, 0]);
        var p2 = getScreenSpaceToWorldLocation([this.x, this.y, 100]);
        var intersection = getHorizontalIntersection(p1, p2, 0);
        if (Number.isFinite(intersection[0]) && Number.isFinite(intersection[1]) && Number.isFinite(intersection[2])) {
            this.pointer_entity.local_transform.setPosition(snapToHexPosition(intersection));
            this.pointer_entity.update(elapsed, true);
            dirty = true;
        }
        super.update(elapsed, dirty);
    }

    drawSelected(renderer, entity) {
        if (entity.model) {
            var transform = mat4.clone(entity.getWorldTransform());
            mat4.scale(transform, transform, [1.1, 1.0, 1.1]);
            renderer.add_drawable(entity.model, materials.light, transform);
        }
        entity.children.forEach(child => this.drawSelected(renderer, child));
    }

    draw(renderer) {
        this.pointer_entity.draw(renderer);
        if (!alt_pressed) {
            if (this.selected_tool == 1) {
                renderer.add_textbox({pos: this.pointer_entity.getWorldPosition(), text: this.blocks[this.block_index].toJSON().class});
            } else if (this.selected_tool == 2) {
                renderer.add_textbox({pos: this.pointer_entity.getWorldPosition(), text: this.dynamics[this.dynamic_index].toJSON().class});
            }
        }
        if (this.selected_tool == 3) {
            selected_entities.forEach(entity => {
                this.drawSelected(renderer, entity);
            });
        }
        if (debug) {
            renderer.add_drawable(models.sphere, materials.light, this.pointer_entity.getWorldTransform());
            
        }
    }
}
