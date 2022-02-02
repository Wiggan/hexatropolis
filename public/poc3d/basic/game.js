'use strict'

var player;
var game;
var classes = {};

class Game {
    constructor() {
        this.scenes = {};
        this.paused = false;
        this.overlay = [0.0, 0.0, 0.0, 0.0];
        this.transition;
    }
    
    loadLevels(levels) {
        for (const [key, value] of Object.entries(JSON.parse(levels))) {
            this.scenes[key] = new Scene(value.name, value.entities);
        }
        this.scene = this.scenes.Downfall;
    }
    
    placePlayer() {        
        player = new Player(getHexPosition(1, 0, 1));
        player.equip(new DoubleLauncher(null, [0, 0, 0]), player.sockets.right_arm);
        player.equip(new Launcher(null, [0, 0, 0]), player.sockets.left_arm);
        this.scene.entities.push(player);
    }

    serialize() {
        return JSON.stringify(this.scenes, null, 4);
    }
    
    update(elapsed) {
        if (!this.paused) {
            this.scene.update(elapsed);
        }
        if (this.transition) {
            this.transition.update(elapsed);
        }
    }

    connectScenes(scene1, scene2, pos1, pos2) {
        var portal1 = new Portal(scene1, getHexPosition(3, 0, 2));
        var portal2 = new Portal(scene2, getHexPosition(5, 0, 6));
        portal1.connect(portal2);
        scene1.entities.push(portal1);
        scene2.entities.push(portal2);
    }

    setScene(scene, player_position) {
        this.paused = true;
        this.transition = new Transition(this, [
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 1.0], paused: false },
                callback: () => {
                    game.scene.remove(player);
                    game.scene = scene;
                    game.scene.entities.push(player);
                    player.local_transform.setPosition(player_position);
                    game.scene.update(0);
                }
            },
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 0.0], transition: null }
            }
        ]);
    }

    save() {
        var persistent = {
            inventory: player.inventory,
            position: player.getWorldPosition(),
            //equipment: player.equipment,
            scene: game.scene.name
        };
        document.cookie = 'slot1=' + JSON.stringify(persistent) +';expires=Tue, 19 Jan 2038 04:14:07 GMT';
    }

    load() {
        let splitCookie = document.cookie.split('=')[1];
        var persistent = JSON.parse(splitCookie);
        if (persistent.scene && persistent.position) {
            this.setScene(this.scenes[persistent.scene], persistent.position);
        }
        if (persistent.inventory) {
            player.inventory = persistent.inventory;
        }
    }
}
