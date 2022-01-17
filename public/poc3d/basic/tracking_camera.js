'use strict'

class TrackingCamera extends Camera {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.transform.pitch(-60);//.lookAt([0,0,0]);
        this.transform.yaw(0);
    }

    onKeyDown(e) {
        super.onKeyDown(e);
    }

    onKeyUp(e) {

    }

    onclick(e) {

    }

    update(elapsed) {
        super.update(elapsed);
    }
}