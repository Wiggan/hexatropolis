'use strict'

class Player extends Entity {
    constructor(local_position) {
        super(null, local_position);
        this.base = new Base(this, [0, 0, 0]);
        this.body = new Body(this, [0, 0, 0]);
        this.head = new Head(this, [0, 0, 0]);
        this.camera = new TrackingCamera(this, [0, 10, 4]);
        this.transform.scale(0.3);
    }
}

class Base extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.crawlers);
    }
}

class Body extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.body);
    }
}

class Head extends Drawable {
    constructor(parent, local_position) {
        super(parent, local_position, models.robot.head);
    }
}