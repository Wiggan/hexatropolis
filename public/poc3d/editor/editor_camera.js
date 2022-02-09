'use strict'

class EditorCamera extends Camera {
    constructor(local_position) {
        super(null, local_position);
        this.original_position = local_position;
        this.local_transform.pitch(-90);
        this.x = 10;
        this.y = 10;
        this.velocity = [0, 0, 0];
        this.wheel = 0;

        this.tools = [
            new SelectionTool(),
            new BlockTool(),
            new ObjectTool()
        ]
        this.active_tool = this.tools[0];
        this.undo_stack = new Stack(10);
    }

    toJSON(key) { 
        return {}; 
    }

    pushToUndoStackIfNeeded(original_json, new_json) {
        if (original_json != new_json) {
            this.undo_stack.push(original_json);
        }
    }

    undo() {
        if (!this.undo_stack.isEmpty()) {
            var previous = JSON.parse(this.undo_stack.pop());
            game.scene = new Scene(previous.name, previous.entities);
        }
    }

    activate() {
        super.activate();
        document.addEventListener("mousemove", active_camera.updatePosition, false);
        document.addEventListener("wheel", active_camera.updateScroll, false);
    }
    
    deactivate() {
        document.removeEventListener("mousemove", active_camera.updatePosition, false);
        document.removeEventListener("wheel", active_camera.updateScroll, false);
    }

    updatePosition(e) {
        active_camera.x = e.clientX;
        active_camera.y = e.clientY;
    }

    updateScroll(e) {
        active_camera.local_transform.translate([0, -e.wheelDeltaY/100, 0]);
        return false;
    }

    onKeyDown(e) {
        super.onKeyDown(e);
        if (e.key == 'Alt') {
            alt_pressed = true;
            e.preventDefault();
        } else if (e.key == 'Control') {
            ctrl_pressed = true;
            e.preventDefault();
        } else if (e.key == 'w' || e.key == 'W') {
            this.velocity[2] = -0.005;
        } else if (e.key == 's' || e.key == 'S') {
            this.velocity[2] = 0.005;
        } else if ((e.key == 'a' || e.key == 'A') && !e.shiftKey) {
            this.velocity[0] = -0.005;
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0.005;
        } else if (e.key == ' ') {
            this.local_transform.setPosition(this.original_position);
        } else if (e.key == '1') {
            this.active_tool = this.tools[0];
        } else if (e.key == '2') {
            this.active_tool = this.tools[1];
        } else if (e.key == '3') {
            this.active_tool = this.tools[2];
        } else if (e.key == 'z' && e.ctrlKey) {
            this.undo();
        }
        var original_json = JSON.stringify(game.scene);
        this.active_tool.onKeyDown(e);
        this.pushToUndoStackIfNeeded(original_json, JSON.stringify(game.scene));
    }

    onKeyUp(e) {
        if (e.key == 'Alt') {
            alt_pressed = false;
            e.preventDefault();
        } else if (e.key == 'Control') {
            ctrl_pressed = false;
            e.preventDefault();
        } else if (e.key == 'w' || e.key == 'W') {
            this.velocity[2] = 0;
        } else if (e.key == 's' || e.key == 'S') {
            this.velocity[2] = 0;
        } else if (e.key == 'a' || e.key == 'A') {
            this.velocity[0] = 0;
        } else if (e.key == 'd' || e.key == 'D') {
            this.velocity[0] = 0;
        }
        var original_json = JSON.stringify(game.scene);
        this.active_tool.onKeyUp(e);
        this.pushToUndoStackIfNeeded(original_json, JSON.stringify(game.scene));
    }

    onmousedown(e) {
        var original_json = JSON.stringify(game.scene);
        this.active_tool.onmousedown(e, pickable_map.get(selected_id));
        this.pushToUndoStackIfNeeded(original_json, JSON.stringify(game.scene));
        e.preventDefault();
    }

    onmouseup(e) {
        var original_json = JSON.stringify(game.scene);
        this.active_tool.onmouseup(e, pickable_map.get(selected_id));
        this.pushToUndoStackIfNeeded(original_json, JSON.stringify(game.scene));

        e.preventDefault();
    } 

    onclick(e) {
        e.preventDefault();
    }

    update(elapsed, dirty) {
        var p1 = getScreenSpaceToWorldLocation([this.x, this.y, 0]);
        var p2 = getScreenSpaceToWorldLocation([this.x, this.y, 100]);
        var intersection = getHorizontalIntersection(p1, p2, 0);
        if (Number.isFinite(intersection[0]) && Number.isFinite(intersection[1]) && Number.isFinite(intersection[2])) {
            this.active_tool.setPosition(intersection);
        }
        this.active_tool.update(elapsed, dirty);
        super.update(elapsed, dirty);
    }

    draw(renderer) {
        this.active_tool.draw(renderer);
        if (debug) {
            renderer.add_drawable(models.sphere, materials.light, this.pointer_entity.getWorldTransform());
        }
    }
}

class Stack {
    constructor(maxSize) { // Set default max size if not provided
       if (isNaN(maxSize)) {
          maxSize = 10;
       }
       this.maxSize = maxSize; // Init an array that'll contain the stack values.
       this.container = [];
    }
    display() {
       console.log(this.container);
    }
    isEmpty() {
       return this.container.length === 0;
    }
    isFull() {
       return this.container.length >= this.maxSize;
    }
    push(element) { // Check if stack is full
       if (this.isFull()) {
        this.container.shift();
       }
       this.container.push(element);
    }
    pop() { // Check if empty
       if (this.isEmpty()) {
          console.log("Stack Underflow!"); 
          return;
       }
       return this.container.pop();
    }
    peek() {
       if (isEmpty()) {
          console.log("Stack Underflow!");
          return;
       }
       return this.container[this.container.length - 1];
    }
    clear() {
       this.container = [];
    }
 }