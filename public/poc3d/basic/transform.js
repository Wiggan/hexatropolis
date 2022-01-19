'use strict';

class Transform {
    #position;
    #scale;
    #yaw;
    #pitch;
    #roll;
    #dirty;
    #transform;
    constructor(position) {
        this.#position = vec3.fromValues(position[0], position[1], position[2]);
        this.#scale = vec3.fromValues(1, 1, 1);
        this.#yaw = 0;
        this.#pitch = 0;
        this.#roll = 0;
        this.#dirty = true;
        this.#transform = mat4.create();
    }
    
    get() {
        if (this.#dirty) {
            mat4.identity(this.#transform);
            mat4.translate(this.#transform, this.#transform, this.#position);
            mat4.rotateZ(this.#transform, this.#transform, this.#roll * Math.PI / 180);
            mat4.rotateY(this.#transform, this.#transform, this.#yaw * Math.PI / 180);
            mat4.rotateX(this.#transform, this.#transform, this.#pitch * Math.PI / 180);
            mat4.scale(this.#transform, this.#transform, this.#scale);
            this.#dirty = false;
        }
        return this.#transform;
    }

    setPosition(position) {
        this.#dirty = true;
        this.#position = vec3.fromValues(position[0], position[1], position[2]);
    }

    translate(movement) {
        this.#dirty = true;
        vec3.add(this.#position, this.#position, movement);
    }

    yaw(delta) {
        this.#dirty = true;
        this.#yaw += delta;
    }

    pitch(delta) {
        this.#dirty = true;
        this.#pitch += delta;
    }

    getPitch() {
        return this.#pitch;
    }

    roll(delta) {
        this.#dirty = true;
        this.#roll += delta;
    }

    scale(scale) {
        this.#dirty = true;
        this.#scale = vec3.fromValues(scale, scale, scale);
    }

    isDirty() {
        return this.#dirty;
    }
}