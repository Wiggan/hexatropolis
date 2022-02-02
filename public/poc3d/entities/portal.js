'use strict'

class Portal extends Pickable {
    constructor(scene, position, destination_scene_name) {
        super(null, position);
        this.scene = scene;
        this.destination_scene_name = destination_scene_name || 'None';
        this.hex = new Floor(this, [0, 0.1, 0]);
        this.hex.material = materials.blue;
        this.particle_socket = new Entity(this, [0, 0, 0]);
        this.particles = new Blue(this.particle_socket, [0, 1, -0.5]);
        this.rotation_speed = 1;
        this.label = "Portal";
    }

    toJSON(key) {
        return {
            type: 'Portal',
            local_position: this.position,
            destination_scene_name: this.destination_scene_name
        };
    }

    interact() {
        //transition to destination
        var destination_scene = game.scenes[this.destination_scene_name];
        // find a portal in destination scene leading to this scene
        var destination_portal = destination_scene.entities.find(entity => entity.type == 'Portal' && entity.destination_scene_name == this.scene.name);
        game.setScene(destination_scene, destination_portal.getWorldPosition());
    }
/* 
    connect(other) {
        this.destination = other;
        other.destination = this;
        this.label = "To: " + this.scene.name;
        other.label = "To: " + other.scene.name;
    }
 */
    update(elapsed, dirty) {
        this.particle_socket.local_transform.yaw(elapsed * this.rotation_speed);
        this.particle_socket.local_transform.setPosition([0, Math.sin(Date.now()*0.005), 0]);
        super.update(elapsed, true);
    }
}

classes.Portal = Portal;