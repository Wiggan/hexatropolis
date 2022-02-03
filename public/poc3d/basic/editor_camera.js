'use strict'

var selected_entity, selected_gui;

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
        this.local_transform.pitch(-60);
        this.x = 10;
        this.y = 10;
        this.velocity = [0, 0, 0];
        this.wheel = 0;
        this.pointer_entity = new Entity(null, [0,0,0]);
        this.blocks = [new Wall(null, [0,0,0]),
                       new Floor(null, [0,0,0]),
                       new Lantern(scene, [0,0,0]),
                       new Portal(scene, [0,0,0])];

        this.blocks.forEach(block => block.material = materials.blue);
        this.block_index = 0;
        this.pointer_entity.addChild(this.blocks[this.block_index]);
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
        active_camera.wheel += Number(e.wheelDeltaY);
        return false;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
        if (e.key == 'Alt') {
            alt_pressed = true;
            picking = true;
            e.preventDefault();
        } else if (e.key == 'Control') {
            ctrl_pressed = true;
            e.preventDefault();
        } else if (e.key == 'w' || e.key == 'W') {
            this.velocity[2] = -0.005;
        } else if (e.key == 's' || e.key == 'S') {
            this.velocity[2] = 0.005;
        } else if (e.key == 'a' || e.key == 'A') {
            this.velocity[0] = -0.005;
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0.005;
        } else if (e.key == ' ') {
            this.local_transform.setPosition(this.original_position);
        }
    }

    onKeyUp(e) {
        if (e.key == 'Alt') {
            alt_pressed = false;
            picking = false;
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

    selectEntity(entity) {
        selected_entity = entity;
        if (selected_gui) {
            gui.removeFolder(selected_gui);
        }
        selected_gui = gui.addFolder('Selected');
        var persistent = selected_entity.toJSON();
        Object.assign(entity, persistent);
        for (const [key, value] of Object.entries(persistent)) {
            if (key == 'destination_scene_name') {
                //selected_gui.add(selected_entity, key, Object.keys(game.scenes));
                selected_gui.add(persistent, key, Object.keys(game.scenes)).onChange((v) => selected_entity[key] = v);
            }
        }
        selected_gui.open();
    }

    onmousedown(e) {
        if (e.button == 0) {
            if (alt_pressed) {
                this.selectEntity(pickable_map.get(selected_id));
            } else {
                var new_entity = new classes[this.blocks[this.block_index].toJSON().class](game.scene, this.pointer_entity.getWorldPosition());
                this.selectEntity(new_entity);
                game.scene.entities.push(new_entity);
            }
        } else if (e.button == 2) {

        }
        e.preventDefault();
    }
    onmouseup(e) {
        e.preventDefault();
    } 

    onclick(e) {
        e.preventDefault();
    }

    update(elapsed, dirty) {
        var block_index = Math.floor(this.wheel / 120) % this.blocks.length;
        if (block_index < 0) block_index += this.blocks.length;
        if (block_index != this.block_index) {
            this.block_index = block_index;
            this.pointer_entity.removeAllChildren();
            this.pointer_entity.addChild(this.blocks[this.block_index]);
        }

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

    draw(renderer) {
        if (!alt_pressed) {
            this.pointer_entity.draw(renderer);
        }
        if (debug) {
            renderer.add_drawable(models.sphere, materials.light, this.pointer_entity.getWorldTransform());
            
        }
    }
}
