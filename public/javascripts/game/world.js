
class Cavern extends Set {
    constructor(tile_size, points_of_interest) {
        super();
        this.tile_size = tile_size;
        this.generate(points_of_interest);
    }

    generate(points_of_interest) {
        var tail = points_of_interest.pop();
        this.add(Array.from(tail));  // clone
        const max_attempts = 200;
        var attempts = 0;
        while (points_of_interest.length > 0) {
            var target = points_of_interest.pop();
            while (!this.contains(target) && attempts < max_attempts) {
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
                this.add(Array.from(tail));
                // Sometimes fatten up around the newly added tile
                if (Math.random() < 0.5) {
                    var tile1 = Array.from(tail);
                    var tile2 = Array.from(tail);
                    const index = Math.floor(Math.random()*2);
                    tile1[index]++;
                    tile2[index]--;
                    this.add(tile1);
                    this.add(tile2);
                    //if (Math.random() < 0.2) {
                    //    this.monsters.push(new Monster({x: tail[0]*tile_size, y: tail[1]*tile_size}));
                    //    this.monsters.push(new Monster({x: tile1[0]*tile_size, y: tile1[1]*tile_size}));
                    //    this.monsters.push(new Monster({x: tile2[0]*tile_size, y: tile2[1]*tile_size}));
                    //}
                }
                attempts++;
            }
        }
    }
    
    add(entry) {
        if (!this.contains(entry)) {
            super.add(entry);
        }
    }

    contains(entry) {
        for (let item of this) {
            if (array2_equals(item, entry)) {
                return true;
            }
        }
        return false;
    }

    draw() {
        this.forEach((tile) => {
            game_context.fillStyle = "SaddleBrown";
            game_context.fillRect(tile[0] * this.tile_size, tile[1] * this.tile_size, this.tile_size, this.tile_size);
        });
        
    }
}

class World {
    constructor() {
        this.cavern = new Cavern(32, [[1, 1], [10, 10], [1, 10]]);
        this.player = new Player({x: 0, y: 0});
        this.monsters = this.create_monster_pack();
        this.projectiles = [];
        this.drops = [];
    }

    create_monster_pack() {
        var pack = [];
        pack.push(new Monster({x: 10, y: 10, pack: pack}));
        pack.push(new Monster({x: 20, y: 10, pack: pack}));
        pack.push(new Monster({x: 30, y: 10, pack: pack}));
        pack.push(new Monster({x: 20, y: 20, pack: pack}));
        pack.push(new Monster({x: 10, y: 20, pack: pack}));
        return pack;
    }

    check_narrow_phase_collision(actor) {
        const monster_collision = !this.monsters.every((monster) => {
            const free_from_collision = !this.check_actor_collision(actor, monster);
            return free_from_collision;
        });
        return monster_collision || this.check_actor_collision(actor, this.player) || this.check_cavern_collision(actor);
    }

    check_actor_collision(actor_a, actor_b) {
        if (actor_a == actor_b) {
            return false;
        }
        const distance = length(add(actor_a.position, actor_a.collision.position), add(actor_b.position, actor_b.collision.position));
        return distance <= actor_a.collision.radius + actor_b.collision.radius;
    }

    check_cavern_collision(actor) {
        return false;
    }

    update(elapsed) {
        var actors_to_update = [this.player];
        actors_to_update.push.apply(actors_to_update, this.monsters);
        actors_to_update.push.apply(actors_to_update, this.projectiles);
        actors_to_update.forEach((actor) => {  
            actor.update(elapsed);
        });
    }
    
    draw() {
        this.cavern.draw();
        var actors_to_draw = [this.player];
        actors_to_draw.push.apply(actors_to_draw, this.monsters);
        actors_to_draw.push.apply(actors_to_draw, this.projectiles);
        actors_to_draw.sort((a, b) => {
            return a.position.y - b.position.y;
        });
        actors_to_draw.forEach((actor) => {
            actor.draw();
        });
    }
}

function screen_to_world({x, y}) {
    return {x: x/scale + world.player.position.x - game_canvas.clientWidth/2/scale, y: y/scale + world.player.position.y - game_canvas.clientHeight/2/scale};
}
function world_to_screen({x, y}) {
    return {x: x - game_canvas.clientWidth / 2 , y: y - game_canvas.clientHeight / 2};
}

