
class Cavern {
    constructor(tile_size, start, end) {
        this.tile_size = tile_size;
        this.monsters = [];
        this.tiles = new Set();
        this.tiles.add(start);
        var tail = Array.from(start);
        const max_attempts = 200;
        var attempts = 0;
        while((end[0] != tail[0] || end[1] != tail[1]) && attempts < max_attempts) {
            var dir;
            // Often walk towards the endpoint
            if (Math.random() < 0.3) {
                dir = direction({x: tail[0], y: tail[1]}, {x: end[0], y: end[1]});
            } else {
                dir = random_direction();
            }
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                tail[0] += Math.round(dir.x);
            } else {
                tail[1] += Math.round(dir.y);
            }
            this.tiles.add(Array.from(tail));
            // Sometimes fatten up around the newly added tile
            if (Math.random() < 0.5) {
                var tile1 = Array.from(tail);
                var tile2 = Array.from(tail);
                const index = Math.floor(Math.random()*2);
                tile1[index]++;
                tile2[index]--;
                this.tiles.add(tile1);
                this.tiles.add(tile2);
                if (Math.random() < 0.2) {
                    this.monsters.push(new Monster({x: tail[0]*tile_size, y: tail[1]*tile_size}));
                    this.monsters.push(new Monster({x: tile1[0]*tile_size, y: tile1[1]*tile_size}));
                    this.monsters.push(new Monster({x: tile2[0]*tile_size, y: tile2[1]*tile_size}));
                }
            }
            attempts++;
        }
    }
    
    update(elapsed) {
        this.monsters.forEach((monster) => {
            monster.update(elapsed);
        });
    }

    draw(game_ctx) {
        this.tiles.forEach((tile) => {
            game_ctx.fillStyle = "SaddleBrown";
            game_ctx.fillRect(tile[0] * this.tile_size, tile[1] * this.tile_size, this.tile_size, this.tile_size);
        });
        this.monsters.forEach((monster) => {
            monster.draw(game_ctx);
        });
    }
}

class World {
    constructor() {
        this.cavern = new Cavern(16, [1, 1], [10, 10]);
        this.player = new Player({x: 0, y: 0});
        this.projectiles = [];
        this.drops = [];   
    }



    update(elapsed) {
        this.cavern.update(elapsed);
        this.player.update(elapsed);
        this.projectiles.forEach((projectile) => {
            projectile.update(elapsed);
        });
    }
    
    draw(game_ctx) {
        this.cavern.draw(game_ctx);
        this.player.draw(game_ctx);
        this.projectiles.forEach((projectile) => {
            projectile.draw(game_ctx);
        });
    }
}
const scale = 10;
function screen_to_world2({x, y}) {
    return {x: game_canvas.clientWidth / 2 / scale - x/ scale - world.player.position.x, y: game_canvas.clientHeight/2/ scale - y/ scale - world.player.position.y };
}

function world_to_screen2({x, y}) {
    return {x: game_canvas.clientWidth / 2 - (world.player.position.x + x) * scale, y: game_canvas.clientHeight / 2 - (world.player.position.y + y) * scale};
}

function screen_to_world({x, y}) {
    return {x: x/scale + world.player.position.x - game_canvas.clientWidth/2/scale, y: y/scale + world.player.position.y - game_canvas.clientHeight/2/scale};
}
function world_to_screen({x, y}) {
    return {x: x - game_canvas.clientWidth / 2 , y: y - game_canvas.clientHeight / 2};
}

