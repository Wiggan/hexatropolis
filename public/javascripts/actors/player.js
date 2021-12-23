
class Player extends Actor {
    constructor({x, y}) {
        super({x, y});
        this.skills = [fireball(0, 0), undefined, undefined, undefined];
        this.left_mouse_button_action = this.walk;
        this.right_mouse_button_action = this.skills[0].effect;
        this.sprites = robot_1_idle; 
        this.shadow = shadow_large;
        this.walk_speed = 100;
        this.brightness = 4;
    }

    update(elapsed) {
        super.update(elapsed);
        if (this.health > 0) {
            if (length(this.position, this.target_position) > 1) {
                this.position.x += this.walk_speed * elapsed * this.direction.x;
                this.position.y += this.walk_speed * elapsed * this.direction.y;
            }
        }
    }
}