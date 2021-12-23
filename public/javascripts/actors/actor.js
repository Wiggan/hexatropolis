
class Actor {
    constructor({x, y}) {
        this.position = {x, y};
        this.target_position = {x, y};
        this.walk_speed = 10;
        this.size = {x: 8, y: 8};
        this.direction = {x: 1, y: 0};
        this.health = 100;
        this.color = "green";
    }

    walk({instigator, target_position}) {
        this.target_position = target_position;
        this.direction = direction(this.position, this.target_position);
    }
    
    draw(game_ctx) {
        game_ctx.save();
        game_ctx.translate(Math.round(this.position.x), Math.round(this.position.y));
        game_ctx.fillStyle = this.color;
        game_ctx.fillRect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
        game_ctx.restore();
    }
}