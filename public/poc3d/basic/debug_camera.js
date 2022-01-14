'use strict'

class DebugCamera extends Camera {
    constructor(position) {
        super(position);

    }

    updatePosition(e) {
        this.transform.yaw(-e.movementX/10);
        this.transform.pitch(-e.movementY/10);
    }

    onKeyUp(e) {
        const viewMatrix = this.getViewMatrix();
        if (e.key == 'ArrowDown' || e.key == 's' || e.key == 'S') {
            this.transform.translate([viewMatrix[2], viewMatrix[6], viewMatrix[10]]);
            e.preventDefault();
        } else if (e.key == 'ArrowLeft' || e.key == 'a' || e.key == 'A') {
            this.transform.translate([-viewMatrix[0], -viewMatrix[4], -viewMatrix[8]]);
            e.preventDefault();
        } else if (e.key == 'ArrowRight' || e.key == 'd' || e.key == 'D') {
            this.transform.translate([viewMatrix[0], viewMatrix[4], viewMatrix[8]]);
            e.preventDefault();
        } else if (e.key == 'ArrowUp' || e.key == 'w' || e.key == 'W') {
            this.transform.translate([-viewMatrix[2], -viewMatrix[6], -viewMatrix[10]]);
            e.preventDefault();
        }
    }

    activate() {
        super.activate();
    }
}