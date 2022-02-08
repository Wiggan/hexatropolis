'use strict'

class BlockTool extends Tool {
    constructor(scene) {
        super();
        this.blocks = [new Wall(this, [0,0,0]),
                       new Floor(null, [0,0,0]),
                       new Lantern(scene, [0,0,0]),
                       new Portal(scene, [0,0,0]),
                       new FloorButton(null, [0,0,0]),
                       new SinkableWall(null, [0,0,0]),
                    ];
        this.blocks.forEach(block => block.material = materials.blue);
        this.block_index = 0;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
        if (e.key == 'ArrowUp') {
            this.changeBlock(1);
        } else if (e.key == 'ArrowDown') {
            this.changeBlock(-1);
        }
    }
    
    onKeyUp(e) {
        super.onKeyUp(e);
    }

    onmousedown(e, clicked_entity) {
        super.onmousedown(e, clicked_entity);
    }
    
    onmouseup(e, clicked_entity) {
        super.onmouseup(e, clicked_entity);
        
        if (e.button == 0) {
            var blockInPosition = this.getBlockInPosition(this.getWorldPosition());
            if (e.altKey) {
                //clicked_entity // Fix "color picking"
                if (blockInPosition) {
                    var block_index = this.blocks.findIndex(block => block.toJSON().class == blockInPosition.class);
                    if (block_index != -1) {
                        console.log("Picked " + block_index + " " + blockInPosition.class);
                        this.setBlock(block_index);
                    }
                }
            } else {
                if (blockInPosition) {
                    game.scene.remove(blockInPosition);
                }
                var new_entity = new classes[this.blocks[this.block_index].toJSON().class](game.scene, this.getWorldPosition());    
                if (!new_entity.id) {
                    new_entity.makePickable();
                }
                game.scene.entities.push(new_entity);
            }
        } else if (e.button == 2) {
            game.scene.remove(clicked_entity);
        }
    }

    draw(renderer) {
        if (alt_pressed) {
            
        } else {
            super.draw(renderer);
            renderer.add_textbox({pos: this.getWorldPosition(), text: this.blocks[this.block_index].toJSON().class});
        }
    }

    getBlockInPosition(pos) {
        return game.scene.entities.find(entity => {
            var pos1 = entity.getWorldPosition();
            return Math.abs(pos1[0] - pos[0]) < 0.01 && Math.abs(pos1[2] - pos[2]) < 0.01;
        });
    }

    setBlock(block_index) { 
        this.block_index = block_index;
        this.removeAllChildren();
        this.addChild(this.blocks[this.block_index]);
    }

    changeBlock(delta) {
        var block_index = (this.block_index + delta) % this.blocks.length;
        if (block_index < 0) block_index += this.blocks.length;
        this.setBlock(block_index);
    }
}