'use strict';

const CollisionTypes = {
    NoCollision: 'NoCollision',
    Level: 'Level',
    Actor: 'Actor',
    Projectile: 'Projectile'
};

class Entity {
    constructor(parent, local_position) {
        this.parent = parent;
        this.children = [];
        this.local_transform = new Transform(local_position);
        this.world_transform = mat4.clone(this.local_transform.get());
        if (this.parent) {
            mat4.mul(this.world_transform, this.parent.world_transform, this. local_transform.get());
            this.parent.children.push(this);
        }
        this.look_at = undefined;
        this.rotation_speed = 0.5;
        this.velocity = undefined;
        this.collider = {
            radius: 1,
            type: CollisionTypes.NoCollision
        };
    }

    draw(renderer) {
        this.children.forEach(child => child.draw(renderer));
    }

    update(elapsed, dirty) {
        dirty |= this.local_transform.isDirty();
        if (this.look_at) {
            var target_vector = vec3.create();
            vec3.sub(target_vector, this.look_at, position(this.getWorldTransform()));
            var forward_vector = forward(this.getWorldTransform());
            var angle = rad2deg(getHorizontalAngle(target_vector, forward_vector));

            if (Math.abs(angle) > 0.005) {
                var angle_increment = Math.sign(angle) * Math.min(Math.abs(angle), this.rotation_speed * elapsed);
                this.local_transform.yaw(angle_increment);
                dirty = true;
            }
        }
        if (this.velocity) {
            var movement = vec3.create();
            vec3.scale(movement, this.velocity, elapsed);
            this.local_transform.translate(movement);
            if (this.collider.type != CollisionTypes.NoCollision) {
                this.last_movement = movement;
                scene.entities.forEach((other) => {
                    if (this != other && other.collider.type != CollisionTypes.NoCollision) {
                        if (getHorizontalDistance(this.local_transform.getPosition(), other.getWorldPosition()) < this.collider.radius + other.collider.radius) {
                            //console.log(this.collider.type + " collided with " + other.collider.type);
                            this.onCollision(other);
                        } 
                    }
                });
            }
        }
        if(dirty) {
            if (this.parent) {
                mat4.mul(this.world_transform, this.parent.world_transform, this.local_transform.get());
            } else {
                mat4.copy(this.world_transform, this.local_transform.get());
            }
        }
        this.children.forEach(child => child.update(elapsed, dirty));   
    }

    onCollision(other) {
        console.log("entity collided");
        // Revert movement that caused collision
        vec3.scale(this.last_movement, this.last_movement, -1.1);
        this.local_transform.translate(this.last_movement);
    }

    getLocalTransform() {
        return this.local_transform.get();
    }

    getWorldTransform() {
        return this.world_transform;
    }

    getWorldPosition() {
        var location = vec3.create();
        mat4.getTranslation(location, this.world_transform);
        return location;
    }

    getLocalPosition() {
        return this.local_transform.getPosition();
    }

    getSquaredHorizontalDistanceToPlayer() {
        return vec2.sqrDist(vec2.fromValues(this.getWorldPosition()[0], this.getWorldPosition()[2]),
                            vec2.fromValues(player.getWorldPosition()[0], player.getWorldPosition()[2]));
    }

    getDistanceToPlayer() {
        return vec3.dist(this.getWorldPosition(), player.getWorldPosition());
    }

    getForwardVector() {
        return vec3.fromValues(this.world_transform[8], this.world_transform[9], this.world_transform[10]);
    }
}

class Transition {
    constructor(entity, from, to, time) {
        this.entity = entity;
        this.elapsed = 0;
        this.time = time;
        this.from = from;
        this.to = to;
    }

    update(elapsed) {
        this.elapsed += elapsed;
        const t = 0.5 + 0.5 * (Math.cos(this.elapsed / this.time * Math.PI - Math.PI));
        //console.log("t: " + t);
        for (const [key, value] of Object.entries(this.to)) {
            switch (typeof (value)) {
                case 'object':
                    if (Array.isArray(value)) {
                        if (value.length == 2) {
                            vec2.lerp(this.entity[key], this.from[key], this.to[key], t);
                        } else if (value.length == 3) {
                            vec3.lerp(this.entity[key], this.from[key], this.to[key], t);
                        } else if (value.length == 4) {
                            vec4.lerp(this.entity[key], this.from[key], this.to[key], t);
                        }
                    } else {
                        if (this.elapsed >= this.time) {
                            this.entity[key] = this.to[key];
                        }
                    }
                    break;
                case 'boolean':
                case 'string':
                    if (this.elapsed >= this.time) {
                        this.entity[key] = this.to[key];
                    }
                    break;
                case 'number':
                    this.entity[key] = this.from[key] + t * (this.to[key] - this.from[key]);
                    break;
            }
        }
    }
}