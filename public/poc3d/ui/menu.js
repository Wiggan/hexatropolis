'use strict'

function initMenu() {
    document.getElementById("resume").onclick = (e) => {
        game.hideMenu();
    };
    document.getElementById("save").onclick = (e) => {
        game.save();
        game.hideMenu();
    };
    document.getElementById("load").onclick = (e) => {
        mscConfirm('Load?', 'All unsaved progress will be lost.', () => { game.load(); game.hideMenu(); });
    };
    document.getElementById("settings").onclick = async (e) => {
        await enterSettings();
    };
    document.getElementById("back").onclick = async (e) => {
        await leaveSettings();
    };
    document.getElementById("music_slider").oninput = () => {
        settings.music_volume = document.getElementById("music_slider").value;
    };
    document.getElementById("sfx_slider").oninput = () => {
        settings.sfx_volume = document.getElementById("sfx_slider").value;
    };
}

function enterSettings() {
    document.getElementById("menu-content").style.display = "none";
    document.getElementById("menu-content").style.width = "0px";
    document.getElementById("settings-content").style.width = "200px";
    document.getElementById("settings-content").style.display = "flex";
}

function leaveSettings() {
    game.saveSettings();
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("settings-content").style.width = "0px";
    document.getElementById("menu-content").style.width = "200px";
    document.getElementById("menu-content").style.display = "flex";
}

function toggleMenuVisible() {
    if (document.getElementById("outer-container").style.display && document.getElementById("outer-container").style.display != "none") {
        if (document.getElementById("settings-content").style.display && document.getElementById("settings-content").style.display != "none") {
            leaveSettings()
        } else {
            game.hideMenu();
        }
    } else {
        game.showMenu();
    }
}