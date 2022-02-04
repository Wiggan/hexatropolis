'use strict'

const createPromiseFromDomEvent = (eventTarget, eventName) =>
    new Promise((resolve, reject) => {
        const handleEvent = () => {
            eventTarget.removeEventListener(eventName, handleEvent);

            resolve();
        };

        eventTarget.addEventListener(eventName, handleEvent);
});

var sfx = {
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

var music = {

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

function setSfxVolume(volume) {
    for (const [key, value] of Object.entries(sfx)) {
        value.forEach(howl => howl.volume(volume));
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
