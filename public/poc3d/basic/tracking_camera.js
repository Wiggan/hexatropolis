'use strict'

var debug = false;

class TrackingCamera extends Camera {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.transform.pitch(-45);//.lookAt([0,0,0]);
        this.transform.yaw(180);
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