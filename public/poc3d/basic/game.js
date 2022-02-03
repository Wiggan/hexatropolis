'use strict'

var player;
var game;
var classes = {};
var settings = {};

class Game {
    constructor() {
        this.scenes = {};
        this.paused = false;
        this.overlay = [0.0, 0.0, 0.0, 0.0];
        this.transition;
        this.loadSettings();
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

    changeScene(scene, player_position) {
        this.paused = true;
        this.transition = new Transition(this, [
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 1.0], paused: false },
                callback: () => {
                    this.setScene(scene, player_position);
                }
            },
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 0.0], transition: null }
            }
        ]);
    }

    setScene(scene, player_position) {
        game.scene.remove(player);
        game.scene = scene;
        game.scene.entities.push(player);
        player.local_transform.setPosition(player_position);
        game.scene.update(0);
    }

    showMenu() {
        this.transition = new Transition(this, [
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 0.8], paused: true, transition: null},
                callback: () => {
                    game.scene.update(0);
                    document.getElementById("outer-container").style.display = "block";
                } 
            }
        ]);
    }

    hideMenu() {
        document.getElementById("outer-container").style.display = "none";
        //document.getElementById("outer-container").style.opacity = 0.0;
        this.paused = false;
        this.transition = new Transition(this, [
            {
                time: 300,
                to: { overlay: [0.0, 0.0, 0.0, 0.0], transition: null}
            }
        ]);
    }

    save() {
        var cookie = this.getCookie() || {};
        cookie.persistent = {
            inventory: player.inventory,
            position: player.getWorldPosition(),
            //equipment: player.equipment,
            scene: game.scene.name
        };
        this.saveCookie(cookie);
    }

    load() {
        var cookie = this.getCookie() || {};
        if (cookie.persistent) {
            if (cookie.persistent.scene && cookie.persistent.position) {
                this.setScene(this.scenes[cookie.persistent.scene], cookie.persistent.position);
            }
            if (cookie.persistent.inventory) {
                player.inventory = cookie.persistent.inventory;
            }
        }
    }

    saveSettings() {
        var cookie = this.getCookie() || {};
        cookie.settings = settings;
        this.saveCookie(cookie);
    }

    loadSettings() {
        var cookie = this.getCookie() || {};
        if (cookie.settings) {
            settings = cookie.settings;
            document.getElementById("music_slider").value = settings.music_volume;
            console.log(document.getElementById("sfx_slider").value);
            document.getElementById("sfx_slider").value = settings.sfx_volume;
            console.log(document.getElementById("sfx_slider").value);
        }
    }

    saveCookie(cookie) {
        document.cookie = 'cookie=' + JSON.stringify(cookie) +';expires=Tue, 19 Jan 2038 04:14:07 GMT; SameSite=Lax;';
    }

    getCookie() {
        let splitCookie = document.cookie.split(/[=;\s]/);
        var index = splitCookie.indexOf('cookie');
        if (index > 0) {
            return JSON.parse(splitCookie[index + 1]);
        }
    }
}
