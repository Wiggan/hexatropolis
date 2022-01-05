
/**
 * Length of vector made up by the two points
 */
function length(start, end) {
    return Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2);
}

function array2_equals(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}

/**
 * Normalized direction vector
 */
function direction(start, end) {
    const len = length(start, end);
    if (len == 0) {
        return {x: 0, y: 0};
    }
    return {
        x: (end.x - start.x) / len,
        y: (end.y - start.y) / len,
    };
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

function add(a, b) {
    return {x: a.x+b.x, y: a.y+b.y};
}

function divide(vector, divisor) {
    return {x: vector.x / divisor, y: vector.y / divisor};
}

function center_of_actors(actors) {
    var point = {x: 0, y: 0};
    actors.forEach((actor) => {
        point = add(point, actor.position);
    });
    return divide(point, actors.length);
}