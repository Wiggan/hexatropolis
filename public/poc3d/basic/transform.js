'use strict';

class Transform {
    #position;
    #scale;
    #yaw;
    #pitch;
    #roll;
    #dirty;
    #worldMatrix;
    constructor(position) {
        this.#position = vec3.fromValues(position[0], position[1], position[2]);
        this.#scale = vec3.fromValues(1, 1, 1);
        this.#yaw = 0;
        this.#pitch = 0;
        this.#roll = 0;
        this.#dirty = true;
        this.#worldMatrix = mat4.create();
    }
    
    get() {
        if (this.#dirty) {
            mat4.identity(this.#worldMatrix);
            mat4.translate(this.#worldMatrix, this.#worldMatrix, this.#position);
            mat4.rotateZ(this.#worldMatrix, this.#worldMatrix, this.#roll * Math.PI / 180);
            mat4.rotateY(this.#worldMatrix, this.#worldMatrix, this.#yaw * Math.PI / 180);
            mat4.rotateX(this.#worldMatrix, this.#worldMatrix, this.#pitch * Math.PI / 180);
            mat4.scale(this.#worldMatrix, this.#worldMatrix, this.#scale);
            this.#dirty = false;
        }
        return this.#worldMatrix;
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

    roll(delta) {
        this.#dirty = true;
        this.#roll += delta;
    }

    scale(scale) {
        this.#dirty = true;
        this.#scale = vec3.fromValues(scale, scale, scale);
    }
}