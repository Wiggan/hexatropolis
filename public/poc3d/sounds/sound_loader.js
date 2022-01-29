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
        new Audio('/sfx/launch_01.ogg'),
        new Audio('/sfx/launch_02.ogg'),
        new Audio('/sfx/launch_03.ogg'),
        new Audio('/sfx/launch_04.ogg'),
    ],
    rocket_exploding: [
        new Audio('/sfx/rocket_exploding_01.ogg'),
        new Audio('/sfx/rocket_exploding_02.ogg'),
        new Audio('/sfx/rocket_exploding_03.ogg'),
        new Audio('/sfx/rocket_exploding_04.ogg'),
    ],
    rocket_flying: [
        new Audio('/sfx/rocket_flying_01.ogg'),
        new Audio('/sfx/rocket_flying_02.ogg'),
        new Audio('/sfx/rocket_flying_03.ogg'),
    ]
}

async function wait_for_all_audio() {
    for (const [key, value] of Object.entries(sfx)) {
        value.forEach(async (audio) => {await createPromiseFromDomEvent(audio, 'canplaythrough');});
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
