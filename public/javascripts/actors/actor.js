
class Actor {
    constructor(position) {
        this.position = {x: position.x, y: position.y}; // clone...
        this.target_position = {x: position.x, y: position.y}; // clone...
        this.walk_speed = 10;
        this.size = {x: 8, y: 8};
        this.direction = {x: 1, y: 0};
        this.health = 100;
        this.sprites = [];
        this.frame = 0;
        this.frame_time = 0.1;
        this.time_spent_in_frame = 0;
        this.shadow_radius = 20;
        this.rotate = false;
        this.brightness = 1;
    }

    walk({instigator, target_position}) {
        this.target_position = target_position;
        this.direction = direction(this.position, this.target_position);
    }

    draw() {
        draw_shadow({position: this.position, radius: this.shadow_radius});
        if (this.rotate) {
            draw_actor({position: this.position, sprite: this.sprites[this.frame], angle: angle(this.direction)});
        } else {
            draw_actor({position: this.position, sprite: this.sprites[this.frame], angle: 0});
        }
        draw_light({position: {x: this.position.x, y: this.position.y - this.sprites[this.frame].height/2}, brightness: this.brightness});
    }
    
    update(elapsed) {
        this.time_spent_in_frame += elapsed;
        if (this.time_spent_in_frame > this.frame_time) {
            this.frame = (this.frame + 1) % this.sprites.length;
            this.time_spent_in_frame -= this.frame_time;
        }
    }
}