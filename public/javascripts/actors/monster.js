
const MonsterState = {
    Resting: 'Resting',
    Walking: 'Walking',
    Hunting: 'Hunting'
};


class Monster extends Actor {
    constructor({x, y}) {
        super({x, y});
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
        if (Math.random() < 0.5) {
            this.state = MonsterState.Resting;
            this.time_to_spend_in_state = Math.random()*4;
        } else {
            this.state = MonsterState.Walking;
            var dir = random_direction();
            this.walk({instigator: this, target_position: {x: this.target_position.x + dir.x * 30, y: this.target_position.y + dir.y * 30}});
            // console.log("Monster got new target position: " + this.target_position.x + ", " + this.target_position.y);
        }
    }

    update(elapsed) {
        super.update(elapsed);
        if (this.health > 0) {
            this.time_spent_in_state += elapsed;
            if (this.state === MonsterState.Walking) {
                if (length(this.position, this.target_position) > 5) {
                    this.position.x += this.walk_speed * elapsed * this.direction.x;
                    this.position.y += this.walk_speed * elapsed * this.direction.y;
                } else {
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

