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
        game.load();
        game.hideMenu();
    };
    document.getElementById("settings").onclick = (e) => {
        
    };
}

function toggleMenuVisible() {
    if (document.getElementById("outer-container").style.visibility == "visible") {
        game.hideMenu();
    } else {
        game.showMenu();
    }
}