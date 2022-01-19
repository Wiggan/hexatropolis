'use strict'

class TrackingCamera extends Camera {
    constructor(parent, local_position) {
        super(parent, local_position);
        this.local_transform.pitch(-60);
        this.x = 10;
        this.y = 10;
        this.pointing_at = vec3.create();
    }

    activate() {
        document.addEventListener("mousemove", active_camera.updatePosition, false);
    }
    
    deactivate() {
        document.removeEventListener("mousemove", active_camera.updatePosition, false);
    }

    updatePosition(e) {
        active_camera.x = e.clientX;
        active_camera.y = e.clientY;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
    }

    onKeyUp(e) {

    }

    onclick(e) {
        if (e.button == 0) {
            this.parent.goto(this.pointing_at);
        }
    }

    update(elapsed, dirty) {
        var p1 = getScreenSpaceToWorldLocation([this.x, this.y, 0]);
        var p2 = getScreenSpaceToWorldLocation([this.x, this.y, 100]);
        var intersection = getHorizontalIntersection(p1, p2, 0);
        if (Number.isFinite(intersection[0]) && Number.isFinite(intersection[1]) && Number.isFinite(intersection[2])) {
            this.pointing_at = intersection;
            dirty = true;
        }
        super.update(elapsed, dirty);
    }

    draw(renderer) {
        if (debug) {
            var world_transform = mat4.create();
            mat4.fromTranslation(world_transform, this.pointing_at);
    
            renderer.add_drawable(models.sphere, materials.light, world_transform);
        }
    }
}