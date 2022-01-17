'use strict'

class Player extends Entity {
    constructor(position) {
        super(null, position);
        this.model = models.sphere;
        this.transform.scale(3);
        this.camera = new TrackingCamera(this, [0, 2, 1]);
        this.children.push(this.camera);
    }

    draw(renderer) {
        super.draw(renderer);
        renderer.add_drawable(this);
    }
}

