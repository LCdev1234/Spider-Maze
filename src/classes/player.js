import {RigidBody, Rectangle} from "./objects"

export default class Player {
    constructor(cursors, x, y) {
        this.cursors = cursors
        this.x = x
        this.y = y
        this.hitbox = new Rectangle(this.x, this.y, 20, 20, RigidBody.STATE.MOVING)
    }


}