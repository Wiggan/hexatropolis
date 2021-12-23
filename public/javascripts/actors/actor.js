
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
        this.shadow = shadow_medium;
        this.rotate = false;
    }

    walk({instigator, target_position}) {
        this.target_position = target_position;
        this.direction = direction(this.position, this.target_position);
    }

    draw_shadow(game_ctx) {
        game_ctx.save();
        game_ctx.translate(Math.round(this.position.x), Math.round(this.position.y));
        game_ctx.drawImage(this.shadow, -this.shadow.width / 2, -this.shadow.height / 2);
        game_ctx.restore();
    }

    draw(game_ctx) {
        this.draw_shadow(game_ctx);
        game_ctx.save();
        if (this.rotate) {
            game_ctx.translate(Math.round(this.position.x), Math.round(this.position.y)-this.sprites[this.frame].height/2);
            game_ctx.rotate(angle(this.direction));
            game_ctx.translate(-Math.round(this.position.x), -Math.round(this.position.y)+this.sprites[this.frame].height/2);
        }
        game_ctx.drawImage(this.sprites[this.frame], Math.round(this.position.x) - this.sprites[this.frame].width / 2, Math.round(this.position.y)-this.sprites[this.frame].height);
        game_ctx.restore();
        if (debug) {
            game_ctx.save();
            game_ctx.translate(Math.round(this.position.x), Math.round(this.position.y));
            game_ctx.fillStyle = "red";
            game_ctx.fillRect(0, 0, 1, 1);
            game_ctx.restore();
        }
    }
    
    update(elapsed) {
        this.time_spent_in_frame += elapsed;
        if (this.time_spent_in_frame > this.frame_time) {
            this.frame = (this.frame + 1) % this.sprites.length;
            this.time_spent_in_frame -= this.frame_time;
        }
    }
}