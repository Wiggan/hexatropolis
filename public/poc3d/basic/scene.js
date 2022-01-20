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
                [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [1, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0],
                [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]
        });
        this.entities.push(new DebugCamera([6, 6, 8]));
        player = new Player(getHexPosition(0, 0, 0));
        this.entities.push(player);
        this.entities.push(new Pickable(null, [2, 0, 2], models.sphere));
        //this.entities.push(new TrackingCamera(null, [10, 0, 0]));
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
        // Ensure only 4 lights are active.
        lights.sort((a, b) => { return a.getSquaredHorizontalDistanceToPlayer() - b.getSquaredHorizontalDistanceToPlayer();});
        lights.forEach((light, i) => {
            if (i<4) {
                light.active = true;
            } else {
                light.active = false;
            }
        })
        this.entities.forEach(entity => {
            entity.update(elapsed, false);
        });
    }
}