function load_image(url) {
    var img = new Image();
    img.src = url;
    return img;
}

const fireball_images = [
    load_image("images/sprites/fireball_1/fireball_1__0000s_0000_8.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0001_7.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0002_6.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0003_5.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0004_4.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0005_3.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0006_2.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0007_1.png"),
    load_image("images/sprites/fireball_1/fireball_1__0000s_0008_0.png"),
]

const robot_1_idle = [load_image("images/sprites/robot_1/robot.png")];

const robot_2_idle = [
    load_image("images/sprites/robot_2/robot_2_idle__0000s_0003_0.png"),
    load_image("images/sprites/robot_2/robot_2_idle__0000s_0002_1.png"),
    load_image("images/sprites/robot_2/robot_2_idle__0000s_0001_2.png"),
    load_image("images/sprites/robot_2/robot_2_idle__0000s_0000_3.png"),
]
