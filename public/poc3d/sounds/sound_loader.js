'use strict'


var sfx;
var music;

function load_all_sounds() {
    sfx = {
        launch: [
            new Howl({ src: ['/sfx/launch_01.ogg']}),
            new Howl({ src: ['/sfx/launch_02.ogg']}),
            new Howl({ src: ['/sfx/launch_03.ogg']}),
            new Howl({ src: ['/sfx/launch_04.ogg']}),
        ],
        rocket_exploding: [
            new Howl({ src: ['/sfx/rocket_exploding_01.ogg']}),
            new Howl({ src: ['/sfx/rocket_exploding_02.ogg']}),
            new Howl({ src: ['/sfx/rocket_exploding_03.ogg']}),
            new Howl({ src: ['/sfx/rocket_exploding_04.ogg']}),
        ],
        rocket_flying: [
            new Howl({ src: ['/sfx/rocket_flying_01.ogg']}),
            new Howl({ src: ['/sfx/rocket_flying_02.ogg']}),
            new Howl({ src: ['/sfx/rocket_flying_03.ogg']}),
        ]
    }

    music = {
        start_screen: new Howl({ src: ['/music/start_screen.ogg'], loop: true}),
        in_game: new Howl({ src: ['/music/in_game.ogg'], loop: true}),
    }

}

class SFX extends Entity {
    constructor(parent, local_position, sound) {
        super(parent, local_position);
        this.sound = getRandomElement(sound);
        this.id = this.sound.play();
        this.setPosition(parent.getWorldPosition());
    }

    setPosition(pos) {
        this.sound.pos(pos[0], pos[1], pos[2], this.id);
    }

    update(elapsed, dirty) {
        super.update(elapsed, dirty);
        if (dirty) {
            this.setPosition(this.getWorldPosition());
        }
    }

    stop() {
        this.sound.stop(this.id);
    }
}

function playMusic(song) {
    for (const [key, value] of Object.entries(music)) {
        value.stop();
    }
    song.play();
}

function setSfxVolume(volume) {
    for (const [key, value] of Object.entries(sfx)) {
        value.forEach(howl => howl.volume(volume));
    }
}

function setMusicVolume(volume) {
    for (const [key, value] of Object.entries(music)) {
        value.volume(volume);
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
