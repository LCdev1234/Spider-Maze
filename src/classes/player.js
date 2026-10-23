import {RigidBody, Rectangle} from "./objects"
import RenderObject from "./render"
import {Render} from "./render"

export default class Player {
    constructor(cursors, x, y) {
        this.cursors = cursors
        this.x = x
        this.y = y
        this.hitbox = new Rectangle(this.x, this.y, 20, 20, RigidBody.STATE.MOVING)
        
        this.sprite = new RenderObject(Render.scene.add.rectangle(
            0,
            0,
            20,
            20,
            0xff0000
        ), 0, 0, this.hitbox)
    }

    update() {
        const input_x = this.cursors.right.isDown - this.cursors.left.isDown
        const input_y = this.cursors.down.isDown - this.cursors.up.isDown
        this.hitbox.speed_x += input_x
        this.hitbox.speed_y += input_y
    }
}