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
        this.entities.push(new Hex(getHexPosition(0, 3, 0)));
        this.entities.push(new Hex(getHexPosition(1, 3, 0)));
        this.entities.push(new Hex(getHexPosition(2, 3, 0)));
        this.entities.push(new Hex(getHexPosition(3, 3, 0)));
        this.entities.push(new Hex(getHexPosition(4, 3, 0)));
        this.entities.push(new Hex(getHexPosition(0, 3, 3)));
        this.entities.push(new Hex(getHexPosition(0, 3, 1)));
        this.entities.push(new Hex(getHexPosition(0, 3, 2)));
        this.entities.push(new Hex(getHexPosition(1, 0, 1)));
        this.entities.push(new Hex(getHexPosition(1, 0, 2)));
        this.entities.push(new Hex(getHexPosition(2, 0, 1)));
        this.entities.push(new Hex(getHexPosition(2, 0, 2)));
        this.entities.push(new PointLight([6, 2, 8]));
    }

    

    draw(renderer) {
        this.entities.forEach(entity => {
            entity.draw(renderer);
        });
    }

    update() {

    }
}