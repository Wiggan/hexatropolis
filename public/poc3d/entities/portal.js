'use strict'

class Portal extends Pickable {
    constructor(scene, position) {
        super(null, position);
        this.scene = scene;
        this.hex = new Floor(this, [0, 0.1, 0]);
        this.hex.material = materials.blue;
        this.particle_socket = new Entity(this, [0, 0, 0]);
        this.particles = new Blue(this.particle_socket, [0, 1, -0.5]);
        this.rotation_speed = 1;
        this.label = "Portal";
    }

    interact() {
        //transition to destination
        game.scene.remove(player);
        game.scene = this.destination.scene;
        game.scene.entities.push(player);

        player.local_transform.setPosition(this.destination.getWorldPosition());
    }

    connect(other) {
        this.destination = other;
        other.destination = this;
        this.label = "To: " + this.scene.name;
        other.label = "To: " + other.scene.name;
    }

    update(elapsed, dirty) {
        this.particle_socket.local_transform.yaw(elapsed * this.rotation_speed);
        this.particle_socket.local_transform.setPosition([0, Math.sin(Date.now()*0.005), 0]);
        super.update(elapsed, true);
    }
}