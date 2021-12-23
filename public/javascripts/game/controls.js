

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

function init_controls() {
    hud_canvas.addEventListener("mousedown", (e) => {
        const point = screen_to_world({x: e.offsetX, y: e.offsetY});
        if (e.button == LEFT_MOUSE_BUTTON) {
            world.player.left_mouse_button_action({instigator: world.player, target_position: point});
            e.preventDefault();
        } else if (e.button == RIGHT_MOUSE_BUTTON) {
            world.player.right_mouse_button_action({instigator: world.player, target_position: point});
            e.preventDefault();
        }
        console.log("Button: " + e.button + " X: " + point.x + " Y: " + point.y);
        
    }, false);
    hud_canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
}