'use strict'


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
        this.local_transform.pitch(-60);
        this.x = 10;
        this.y = 10;
        this.wheel = 0;
        this.pointer_entity = new Entity(null, [0,0,0]);
        this.blocks = [new Wall(null, [0,0,0]),
                       new Floor(null, [0,0,0]),
                       new Lantern(null, [0,0,0], scene)];

        this.blocks.forEach(block => block.material = materials.blue);
        this.block_index = 0;
    }

    activate() {
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
        if (e.key == 'i' || e.key == 'I') {
            show_inventory = !show_inventory;
        } else if (e.key == 'l') {
            new Loot(player.getWorldPosition(), drop_consumable({max_drop: 5, level:10}));
            e.preventDefault();
        } else if (e.key == 'Alt') {
            alt_pressed = true;
            e.preventDefault();
        } else if (e.key == 'Control') {
            shift_pressed = true;
            e.preventDefault();
        }
    }

    onKeyUp(e) {
        if (e.key == 'Alt') {
            alt_pressed = false;
            e.preventDefault();
        } else if (e.key == 'Control') {
            shift_pressed = false;
            e.preventDefault();
        }
    }

    onmousedown(e) {
        if (e.button == 0) {
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
        var block_index = Math.floor(this.wheel / 50) % this.blocks.length;
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
        this.pointer_entity.draw(renderer);
        if (debug) {
            renderer.add_drawable(models.sphere, materials.light, this.pointer_entity.getWorldTransform());
            
        }
    }
}
