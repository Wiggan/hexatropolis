'use strict'

var debug = false;

class DebugCamera extends Camera {
    constructor(position) {
        super(null, position);
        this.velocity = [0, 0];
    }

    updatePosition(e) {
        this.transform.yaw(-e.movementX/10);
        this.transform.pitch(-e.movementY/10);
    }

    onKeyDown(e) {
        if (e.key == 'F1') {
            debug = !debug;
            e.preventDefault();
        } else if (e.key == 'ArrowDown' || e.key == 's' || e.key == 'S') {
            this.velocity[1] = 1;
            e.preventDefault();
        } else if (e.key == 'ArrowLeft' || e.key == 'a' || e.key == 'A') {
            this.velocity[0] = -1;
            e.preventDefault();
        } else if (e.key == 'ArrowRight' || e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 1;
            e.preventDefault();
        } else if (e.key == 'ArrowUp' || e.key == 'w' || e.key == 'W') {
            this.velocity[1] = -1   ;
            e.preventDefault();
        }
    }

    onKeyUp(e) {
        if (e.key == 'ArrowDown' || e.key == 's' || e.key == 'S') {
            this.velocity[1] = 0;
            e.preventDefault();
        } else if (e.key == 'ArrowLeft' || e.key == 'a' || e.key == 'A') {
            this.velocity[0] = 0;
            e.preventDefault();
        } else if (e.key == 'ArrowRight' || e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0;
            e.preventDefault();
        } else if (e.key == 'ArrowUp' || e.key == 'w' || e.key == 'W') {
            this.velocity[1] = 0;
            e.preventDefault();
        }
    }

    update(elapsed) {
        const viewMatrix = this.getViewMatrix();
        var forward = vec3.fromValues(viewMatrix[2], viewMatrix[6], viewMatrix[10]);
        var right = vec3.fromValues(viewMatrix[0], viewMatrix[4], viewMatrix[8]);
        var translation = vec3.create();
        vec3.scale(forward, forward, this.velocity[1]*elapsed);
        vec3.scale(right, right, this.velocity[0]*elapsed);
        vec3.add(translation, forward, right);
        console.log(this.velocity);
        this.transform.translate(translation);
        super.update(elapsed);
    }

    activate() {
        super.activate();
    }
}