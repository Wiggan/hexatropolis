'use strict';

function getHexPosition(ix, y, iz) {
    const size = 1;
    return [size * Math.sqrt(3) * (ix + 0.5 * (iz&1)),
        y,
        size * 3/2 * iz];
}

class Scene {
    constructor() {
        this.entities = [];
        this.entities.push(new Hex(null, getHexPosition(0, 3, 0)));
        this.entities.push(new Hex(null, getHexPosition(1, 3, 0)));
        this.entities.push(new Hex(null, getHexPosition(2, 3, 0)));
        this.entities.push(new Hex(null, getHexPosition(3, 3, 0)));
        this.entities.push(new Hex(null, getHexPosition(4, 3, 0)));
        this.entities.push(new Hex(null, getHexPosition(0, 3, 3)));
        this.entities.push(new Hex(null, getHexPosition(0, 3, 1)));
        this.entities.push(new Hex(null, getHexPosition(0, 3, 2)));
        this.entities.push(new Hex(null, getHexPosition(1, 0, 1)));
        this.entities.push(new Hex(null, getHexPosition(1, 0, 2)));
        this.entities.push(new Hex(null, getHexPosition(2, 0, 1)));
        this.entities.push(new Hex(null, getHexPosition(2, 0, 2)));
        //this.entities.push(new PointLight(null, [6, 2, 8]));
        this.entities.push(new Lantern(null, getHexPosition(3, 0, 2)));
        this.entities.at(-1).light.diffuse = [1.0, 0.0, 0.0];
        this.entities.push(new Lantern(null, getHexPosition(3, 0, 13)));
        this.entities.at(-1).light.diffuse = [1.0, 1.0, 0.0];
        this.entities.push(new Lantern(null, getHexPosition(3, 0, 40)));
        this.entities.at(-1).light.diffuse = [1.0, 0.0, 1.0];
        this.entities.push(new Lantern(null, getHexPosition(3, 0, 5)));
        this.entities.at(-1).light.diffuse = [0.0, 0.0, 1.0];
        //this.entities.push(new Lantern(null, getHexPosition(14, 0, 14)));
        //this.entities.at(-1).light.diffuse = [0.0, 1.0, 0.0];
        active_camera = new DebugCamera([6, 3, 8]);
        this.entities.push(active_camera);
    }

    draw(renderer) {
        this.entities.forEach(entity => {
            entity.draw(renderer);
        });
    }

    update(elapsed) {
        this.entities.forEach(entity => {
            entity.update(elapsed);
        });
    }
}