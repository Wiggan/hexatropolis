'use strict'

class Portal extends Pickable {
    constructor(scene, position, destination_scene_name) {
        super(null, position);
        this.local_position = position;
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
            class: 'Portal',
            uuid: this.uuid,
            local_position: this.local_position,
            destination_scene_name: this.destination_scene_name
        };
    }

    interact() {
        //transition to destination
        var destination_scene = game.scenes[this.destination_scene_name];
        // find a portal in destination scene leading to this scene
        var destination_portal = destination_scene.entities.find(entity => entity.class == 'Portal' && entity.destination_scene_name == this.scene.name);
        game.changeScene(destination_scene, destination_portal.getWorldPosition());
    }
    
    update(elapsed, dirty) {
        this.particle_socket.local_transform.yaw(elapsed * this.rotation_speed);
        this.particle_socket.local_transform.setPosition([0, Math.sin(Date.now()*0.005), 0]);
        super.update(elapsed, true);
    }
}

classes.Portal = Portal;