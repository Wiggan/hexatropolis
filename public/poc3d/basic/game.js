'use strict'

var player;
var game;

class Game {
    constructor() {
        this.scenes = {
            Downfall: new Scene ({
                name: "Downfall",
                tiles: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 0],
                    [0, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 3, 4, 1, 1, 1, 1, 2, 1, 1, 4, 0],
                    [0, 3, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                entities: []
            }),
            Junction: new Scene({
                name: "Junction",
                tiles: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0],
                    [0, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0],
                    [0, 3, 4, 1, 1, 1, 1, 2, 1, 1, 4, 0],
                    [0, 3, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 4, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                entities: []
            }) 
        };
        
        this.scene = this.scenes.Downfall;        
        
        player = new Player(getHexPosition(1, 0, 1));
        player.equip(new DoubleLauncher(null, [0, 0, 0]), player.sockets.right_arm);
        player.equip(new Launcher(null, [0, 0, 0]), player.sockets.left_arm);
        this.scene.entities.push(player);
        this.connectScenes(this.scenes.Downfall, this.scenes.Junction);
        
        this.scene.entities.push(new DebugCamera([6, 6, 8]));
        
        this.scene.entities.push(new EditorCamera([6, 16, 8], this.scene));
    }

    connectScenes(scene1, scene2, pos1, pos2) {
        var portal1 = new Portal(scene1, getHexPosition(3, 0, 2));
        var portal2 = new Portal(scene2, getHexPosition(5, 0, 6));
        portal1.connect(portal2);
        scene1.entities.push(portal1);
        scene2.entities.push(portal2);
    }

    save() {
        var persistent = {
            inventory: player.inventory,
            //equipment: player.equipment,
            scene: game.scene.name
        };
        document.cookie = 'slot1=' + JSON.stringify(persistent) +'expires=Tue, 19 Jan 2038 04:14:07 GMT';
    }

    load() {
        document.cookie.split(';').reduce((cookieObject, cookieString) => {
        let splitCookie = cookieString.split('=').map((cookiePart) => { cookiePart.trim() })
        try {
            cookieObject[splitCookie[0]] = JSON.parse(splitCookie[1])
        } catch (error) {
            cookieObject[splitCookie[0]] = splitCookie[1]
        }
        return cookieObject
        })
    }
}
