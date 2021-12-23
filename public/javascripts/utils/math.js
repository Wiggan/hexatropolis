
/**
 * Length of vector made up by the two points
 */
function length(start, end) {
    return Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2);
}

/**
 * Normalized direction vector
 */
function direction(start, end) {
    const len = length(start, end);
    var direction = {
        x: (end.x - start.x) / len,
        y: (end.y - start.y) / len,
    };
    return direction;
}

function random_direction() {
    return direction({x: 0, y: 0}, {x: Math.random()*2 - 1, y: Math.random()*2 - 1});
}

function angle(direction) {
    var angle = Math.atan2(direction.y, direction.x);   //radians
    // you need to devide by PI, and MULTIPLY by 180:
    var degrees = 180*angle/Math.PI;  //degrees
    return angle; //(360+Math.round(degrees))%360; //round number, avoid decimal fragments
}