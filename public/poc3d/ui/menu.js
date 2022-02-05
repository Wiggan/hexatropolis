'use strict'

var saved_game_exists = false;

function setSavedGameExists(exists) {
    saved_game_exists = exists;
    document.getElementById("continue").disabled = !exists;
    document.getElementById("load").disabled = !exists;
}

function initMenu() {
    document.getElementById("init").onclick = (e) => {
        init();
        hideView("init-content");
    };
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
        enterSettings();
    };
    document.getElementById("exit").onclick = async (e) => {    
        mscConfirm('Exit to main menu?', 'All unsaved progress will be lost.', () => { 
            hideView("menu-content");
            showView("start-content");
        });
    };
    document.getElementById("back").onclick = async (e) => {
        leaveSettings();
    };
    document.getElementById("music_slider").oninput = () => {
        settings.music_volume = document.getElementById("music_slider").value;
    };
    document.getElementById("sfx_slider").oninput = () => {
        settings.sfx_volume = document.getElementById("sfx_slider").value;
    };
    
    document.getElementById("continue").onclick = (e) => {
        game.load();
        game.hideMenu();
        hideView("settings-content");
        hideView("start-content");
        hideView("menu-content");
    };
    document.getElementById("new_game").onclick = (e) => {
        mscConfirm('Start new game?', 'All unsaved progress will be lost.', () => { 
            game.startNewGame();
            game.hideMenu();
            hideView("settings-content");
            hideView("start-content");
            hideView("menu-content");
        });
    };
    document.getElementById("continue").disabled = true;
    document.getElementById("load").disabled = true;
}

function enterSettings() {
    hideView("menu-content");
    hideView("start-content");
    showView("settings-content");
}

function leaveSettings() {
    game.saveSettings();
    hideView("settings-content");
    hideView("start-content");
    showView("menu-content");
}

function showView(id) {
    document.getElementById(id).style.display = "flex";
}

function hideView(id) {
    document.getElementById(id).style.display = "none";
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