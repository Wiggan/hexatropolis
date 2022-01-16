'use strict';

class Entity {
    constructor(parent, local_position) {
        this.parent = parent;
        this.children = [];
        this.transform = new Transform(local_position);
        if (this.parent) {
            this.parent.children.push(this);
        }
    }

    draw(renderer) {
        this.children.forEach(child => child.draw(renderer));
    }

    getLocalTransform() {
        return this.transform.get();
    }

    getWorldTransform() {
        if (this.parent) {
            var worldTransform = mat4.create();
            mat4.mul(worldTransform, this.parent.getWorldTransform(), this.transform.get());
            return worldTransform;
        } else {
            return this.transform.get();
        }
    }
}