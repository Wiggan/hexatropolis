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
        this.entities_to_draw = [];
       /*  this.parse_level({
            tiles: [
                [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0],
                [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]
        }); */

        //var level = {tiles: this.generate([[1, 1], [50, 90], [20, 20], [50, 50], [90, 90], [2, 5]])};
        this.parse_level({
            tiles: [
                [1, 1, 1],
                [1, 1, 2],
                [0, 4, 3],
            ]
        });
        //this.parse_level(level);
        this.entities.push(new DebugCamera([6, 6, 8]));
        player = new Player(getHexPosition(1, 0, 1));
        this.entities.push(player);
        //this.entities.push(new TrackingCamera(null, [10, 0, 0]));
        //this.entities.push(new FireBlock(null, [0, 4, 0]));
    }

    makeArray(w, h, val) {
        var arr = [];
        for(let i = 0; i < h; i++) {
            arr[i] = [];
            for(let j = 0; j < w; j++) {
                arr[i][j] = val;
            }
        }
        return arr;
    }

    generate(points_of_interest) {
        var level = this.makeArray(100, 100, 0);
        var tail = points_of_interest.pop();
        level[tail[0]][tail[1]] = 2;
        const max_attempts = 200;
        var attempts = 0;
        while (points_of_interest.length > 0) {
            var target = points_of_interest.pop();
            while (level[target[0]][target[1]] == 0 && attempts < max_attempts) {
                var dir;
                // Often walk towards the endpoint
                if (Math.random() < 0.3) {
                    dir = direction({x: tail[0], y: tail[1]}, {x: target[0], y: target[1]});
                } else {
                    dir = random_direction();
                }
                if (Math.abs(dir.x) > Math.abs(dir.y)) {
                    tail[0] += Math.round(dir.x);
                } else {
                    tail[1] += Math.round(dir.y);
                }
                //this.add(Array.from(tail));
                if (tail[0] == target[0] && tail[1] == target[1]) {
                    level[tail[0]][tail[1]] = 2; 
                } else {
                    level[tail[0]][tail[1]] = 1;
                    if (Math.random() < 0.2) {
                        level[tail[0]][tail[1]] = 2; 
                    } else if (Math.random() < 0.4) {
                        level[tail[0]][tail[1]] = 3; 
                    } else if (Math.random() < 0.1) {
                        level[tail[0]][tail[1]] = 4; 
                    } 
                }
                // Sometimes fatten up around the newly added tile
                if (Math.random() < 0.9) {
                    var tile1 = Array.from(tail);
                    var tile2 = Array.from(tail);
                    const index = Math.floor(Math.random()*2);
                    tile1[index]++;
                    tile2[index]--;
                    level[tile1[0]][tile1[1]] = 1; 
                    level[tile2[0]][tile2[1]] = 1;
                    //if (Math.random() < 0.2) {
                    //    this.monsters.push(new Monster({x: tail[0]*tile_size, y: tail[1]*tile_size}));
                    //    this.monsters.push(new Monster({x: tile1[0]*tile_size, y: tile1[1]*tile_size}));
                    //    this.monsters.push(new Monster({x: tile2[0]*tile_size, y: tile2[1]*tile_size}));
                    //}
                }
                attempts++;
            }
        }
        console.log("Generated 2d array");
        return level;
    }

    parse_level(level) {
        for (var x = 0; x < level.tiles[0].length; x++) {
            for (var y = 0; y < level.tiles.length; y++) {
                switch(level.tiles[y][x]) {
                    case 0:
                        var hex = new Hex(null, getHexPosition(x, 3, y));
                        hex.collider.type = CollisionTypes.Level;
                        this.entities.push(hex);
                        break;
                    case 1:
                        this.entities.push(new Hex(null, getHexPosition(x, 0, y)));
                        break;
                    case 2:
                        this.entities.push(new Lantern(null, getHexPosition(x, 0, y)));
                        break;
                    case 3:
                        this.entities.push(new Hex(null, getHexPosition(x, 0, y)));
                        this.entities.push(new Chest(getHexPosition(x, 0, y)));
                        break;
                    case 4:
                        this.entities.push(new Hex(null, getHexPosition(x, 0, y)));
                        this.entities.push(new Drone(getHexPosition(x, 0, y)));
                        break;

                }
            }
        }
    }

    draw(renderer) {
        this.entities_to_draw.forEach(entity => {
            entity.draw(renderer);
        });
        lights.forEach((light) => {
            light.draw(renderer);
        });
    }

    update(elapsed) {
        // Ensure only 4 lights are active. This should probably be done less often...
        lights.sort((a, b) => { return a.getSquaredHorizontalDistanceToPlayer() - b.getSquaredHorizontalDistanceToPlayer();});
        var activeLightCount = lights.filter((light) => light.active).length;
        lights.forEach((light, i) => {
            if (i<4) {
                if (activeLightCount < 4) {
                    light.activate();
                }
            } else {
                light.inactivate();
            }
        });
        this.entities_to_draw = this.entities.filter(entity => entity.getSquaredHorizontalDistanceToPlayer() < 120);
        this.entities.forEach(entity => {
            entity.update(elapsed, false);
        });
    }
}