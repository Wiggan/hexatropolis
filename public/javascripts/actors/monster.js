
const MonsterState = {
    Resting: 'Resting',
    Walking: 'Walking',
    Hunting: 'Hunting'
};


class Monster extends Actor {
    constructor({x, y, pack}) {
        super({x, y});
        this.pack = pack;
        this.state = MonsterState.Resting;
        this.time_spent_in_state = 0;
        this.time_to_spend_in_state = Math.random()*4;
        this.walk_speed = 5;
        this.run_speed = 10;
        this.sprites = robot_2_idle;
        this.shadow_radius = 10;
        console.log("Created monster at x: " + x + ", y: " + y);
    }
    
    pick_new_state() {
        this.time_spent_in_state = 0;
        if (Math.random() < 0.1) {
            this.state = MonsterState.Resting;
            this.time_to_spend_in_state = Math.random()*4;
        } else {
            this.state = MonsterState.Walking;
            var dir = random_direction();
            if (Math.random() < 0.5) {
                const pack_center = center_of_actors(this.pack);
                dir = direction(this.position, pack_center);
            }
            this.walk({instigator: this, target_position: {x: this.position.x + dir.x * 30, y: this.position.y + dir.y * 30}});
            // console.log("Monster got new target position: " + this.target_position.x + ", " + this.target_position.y);
        }
    }

    update(elapsed) {
        super.update(elapsed);
        if (this.health > 0) {
            this.time_spent_in_state += elapsed;
            if (this.state === MonsterState.Walking) {
                this.dx = this.walk_speed * elapsed * this.direction.x;
                this.dy = this.walk_speed * elapsed * this.direction.y;
                this.position.x += this.dx;
                this.position.y += this.dy;
                if(world.check_narrow_phase_collision(this)) {
                    console.log("Collision!");
                    this.position.x -= this.dx;
                    this.position.y -= this.dy;
                    this.pick_new_state();
                } else if (length(this.position, this.target_position) < 5) {
                    this.pick_new_state();
                }
            } else if (this.state === MonsterState.Resting) {
                if (this.time_spent_in_state > this.time_to_spend_in_state) {
                    this.pick_new_state();
                }
            }
        }
    }
}

