'use strict';

var player;

function getHexPosition(ix, y, iz) {
    const size = 1;
    return [size * Math.sqrt(3) * (ix + 0.5 * (iz&1)),
        y,
        size * 3/2 * iz];
}

class Scene {
    constructor() {
        this.entities = [];
        this.parse_level({
            tiles: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0],
                [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]
        });
        this.entities.push(new DebugCamera([6, 3, 8]));
        player = new Player(getHexPosition(3, 0, 2));
        this.entities.push(player);
    }

    parse_level(level) {
        for (var x = 0; x < level.tiles[0].length; x++) {
            for (var y = 0; y < level.tiles.length; y++) {
                if (level.tiles[y][x] == 0) {
                    this.entities.push(new Hex(null, getHexPosition(x, 3, y)));
                } else  if (level.tiles[y][x] == 1) {
                    this.entities.push(new Hex(null, getHexPosition(x, 0, y)));
                } else  if (level.tiles[y][x] == 2) {
                    this.entities.push(new Lantern(null, getHexPosition(x, 0, y)));
                } 
            }
        }
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