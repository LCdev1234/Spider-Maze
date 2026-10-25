import { LevelRender } from "./level"
import {RigidBody, Rectangle} from "./objects"
import RenderObject from "./render"
import {Render} from "./render"
import Phaser from "phaser"

export default class Player {
    static speed = 1.5

    constructor(cursors, x, y) {
        this.cursors = cursors
        this.x = x
        this.y = y
        this.hitbox = new Rectangle(this.x, this.y, 20, 20, RigidBody.STATE.MOVING)
        this.hitbox.tag = "player"
        
        this.sprite = new RenderObject(Render.scene.add.rectangle(
            0,
            0,
            20,
            20,
            0xff0000
        ), 0, 0, this.hitbox)

        this.canJump = true
    }

    update() {
        const input_x = this.cursors.right.isDown - this.cursors.left.isDown
        const jump = this.cursors.up.isDown
        //const input_y = this.cursors.down.isDown - this.cursors.up.isDown
        this.hitbox.speed_x += input_x * Player.speed
        if(this.canJump && jump && this.hitbox.inGround) {
            this.hitbox.speed_y += -10
            this.canJump = false
            Phaser.Input.Keyboard.JustDown(this.cursors.up)
        }else if(this.hitbox.inGround) this.canJump = true

        if(this.hitbox.sliding > 0 && Phaser.Input.Keyboard.JustDown(this.cursors.up)){
            this.hitbox.speed_y += -10
            if(input_x == this.hitbox.sliding_x) this.hitbox.speed_x *= 0.9
            else this.hitbox.speed_x += this.hitbox.sliding_x * 15
            this.hitbox.sliding = 0
        }
    }
}