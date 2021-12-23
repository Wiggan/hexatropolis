class Skill {
    constructor({x, y, name, description, effect, amount}) {
        this.position = {x, y};
        this.name = name;
        this.description = description;
        this.effect = effect;
    }
}

const fireball_images = [
    load_image("images/sprites/fireball_1/fireball_1__0000s_0000_8.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0001_7.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0002_6.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0003_5.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0004_4.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0005_3.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0006_2.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0007_1.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0008_0.png"),
]

class Projectile {
    constructor({instigator, position, direction, sprites}) {
        this.instigator = instigator;
        this.position = position;
        this.direction = direction;
        this.speed = 100;
        this.sprites = sprites;
        this.frame = 0;
        this.frame_time = 0.1;
        this.time_spent_in_frame = 0;
    }    
    
    update(elapsed) {
        this.position.x += this.speed * elapsed * this.direction.x;
        this.position.y += this.speed * elapsed * this.direction.y;
        this.time_spent_in_frame += elapsed;
        if (this.time_spent_in_frame > this.frame_time) {
            this.frame = (this.frame + 1) % this.sprites.length;
            this.time_spent_in_frame -= this.frame_time;
        }
    }
    
    draw(game_ctx) {
        game_ctx.save();
        game_ctx.translate(this.position.x, this.position.y);
        game_ctx.rotate(angle(this.direction));
        game_ctx.translate(-this.sprites[this.frame].width / 2, -this.sprites[this.frame].height / 2);
        game_ctx.drawImage(this.sprites[this.frame], 0, 0);
        
        game_ctx.restore();
    }
}

const fireball_effect = ({instigator, target_position}) => {
    const dir = direction(instigator.position, target_position);
    world.projectiles.push(new Projectile({instigator: instigator, position: { ...instigator.position }, direction: dir, sprites: fireball_images}));
};
const fireball = (x, y) => (new Skill({x: x, y: y, name: "Fireball", description: "Shoots fireballs", effect: fireball_effect}));