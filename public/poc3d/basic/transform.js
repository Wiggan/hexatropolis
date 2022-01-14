'use strict';

class Transform {
    #position;
    #yaw;
    #pitch;
    #roll;
    #dirty;
    #worldMatrix;
    constructor() {
        this.#position = vec3.create();
        this.#yaw = 0;
        this.#pitch = 0;
        this.#roll = 0;
        this.#dirty = true;
        this.#worldMatrix = mat4.create();
    }
    
    getWorldMatrix() {
        if (this.#dirty) {
            mat4.identity(this.#worldMatrix);
            mat4.translate(this.#worldMatrix, this.#worldMatrix, this.#position);
            mat4.rotateZ(this.#worldMatrix, this.#worldMatrix, this.#roll * Math.PI / 180);
            mat4.rotateY(this.#worldMatrix, this.#worldMatrix, this.#yaw * Math.PI / 180);
            mat4.rotateX(this.#worldMatrix, this.#worldMatrix, this.#pitch * Math.PI / 180);
            this.#dirty = false;
        }
        return this.#worldMatrix;
    }

    setPosition(position) {
        this.#dirty = true;
        this.#position = position;
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
}