'use strict';

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
    }

    draw(renderer) {
        this.children.forEach(child => child.draw(renderer));
    }

    update(elapsed, dirty) {
        dirty |= this.local_transform.isDirty();
        if(dirty) {
            if (this.parent) {
                mat4.mul(this.world_transform, this.parent.world_transform, this.local_transform.get());
            } else {
                mat4.copy(this.world_transform, this.local_transform.get());
            }
        }
        this.children.forEach(child => child.update(elapsed, dirty));   
    }

    getLocalTransform() {
        return this.local_transform.get();
    }

    getWorldTransform() {
        return this.world_transform;
    }
}