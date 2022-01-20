
function getScreenSpaceToWorldLocation(position) {
    const rect = gl.canvas.getBoundingClientRect();
    const clipX = (position[0] - rect.left) / rect.width  *  2 - 1;
    const clipY = (position[1] - rect.top) / rect.height * -2 + 1;
    
    var unproj = mat4.create();
    mat4.mul(unproj, projection_matrix, view_matrix);
    mat4.invert(unproj, unproj);
    var world = vec4.fromValues(clipX, clipY, position[2], 1.0);
    
    vec4.transformMat4(world, world, unproj);
    
    vec4.scale(world, world, 1/world[3]);
    
    return world;
}

function getHorizontalIntersection(p1, p2, y) {
    return [
        p1[0] - (p2[0]-p1[0])*(p1[1]-y)/(p2[1]-p1[1]),
        y,
        p1[2] - (p2[2]-p1[2])*(p1[1]-y)/(p2[1]-p1[1])
    ];
}

function forward(transform) {
    return [-transform[8], -transform[9], -transform[10]];
}

function position(transform) {
    return [transform[12], transform[13], transform[14]];
}

function rad2deg(rad) {
    return rad*180/Math.PI;
}

function deg2rad(deg) {
    return deg/180*Math.PI;
}

function getHorizontalAngle(p1, p2) {
    var dot = p1[0]*p2[0] + p1[2]*p2[2];
    var det = p1[0]*p2[2] - p1[2]*p2[0];
    return Math.atan2(det, dot);
}