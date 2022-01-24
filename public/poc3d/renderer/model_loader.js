'use strict'

var models = {};
var materials;

async function load_materials(path) {
    return fetch(path).then(response => response.json()).then(mats => materials = mats);
}

async function load_model(path) {
    return fetch(path)
    .then(response => response.json())
    .then(model => {    
        // Calculate the normals using the `calculateNormals` utility function
        const normals = utils.calculateNormals(model.vertices, model.indices);

        // Create a VAO
        const vao = gl.createVertexArray();
  

        // Bind VAO
        gl.bindVertexArray(vao);

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        // Configure VAO instructions
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Normals
        const normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        // Configure VAO instructions
        gl.enableVertexAttribArray(program.aVertexNormal);
        gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

        // Setting up the IBO
        model.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
        
        // Attach them for later access
        model.vao = vao;

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return model;
    }).catch(console.error);
}

async function load_all_models() {
    materials = await load_materials('/models/materials.json');
    models.block = await load_model('/models/block/part1.json');
    models.sphere = await load_model('/models/sphere/part1.json');
    models.hex = await load_model('/models/hex_chipped/part1.json');
    models.prism = await load_model('/models/prism/part1.json');
    models.lantern = await load_model('/models/lantern/part1.json');
    models.robot = {};
    models.robot.crawlers = await load_model('/models/robot/part1.json');
    models.robot.body = await load_model('/models/robot/part4.json');
    models.robot.head = await load_model('/models/robot/part2.json');
    models.robot.head_lamp = await load_model('/models/robot/part3.json');
    models.robot.body_lamp = await load_model('/models/robot/part5.json');
    models.robot.wrench = await load_model('/models/robot/part6.json');
    models.chest = {};
    models.chest.side = await load_model('/models/chest/part1.json');
    models.chest.side_lamp = await load_model('/models/chest/part2.json');
    models.drone = {};
    models.drone.body = await load_model('/models/drone/part1.json');
    models.drone.lamp = await load_model('/models/drone/part2.json');
}