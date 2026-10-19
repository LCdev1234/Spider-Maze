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
            0,  // x
            0,  // y
            20,   // width
            20,   // height
            0xff0000 // red
        ), 0, 0, this.hitbox)
    }
}