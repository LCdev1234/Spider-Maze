import { LevelRender } from "./level"
import { RigidBody } from "./objects"
import { Render } from "./render"

export default class Physics {
    static GRAVITY = 0.85
    static FRICTION = 0.75
    static bodies

    constructor() {
        this.bodies = new Set()
        Physics.bodies = this.bodies
    }

    addObject(...bodys) {
        for(let body of bodys) {
            this.bodies.add(body)
        }
    }

    update(fpsRatio) {
        let collisionPoints = new Set()
        for(let body of this.bodies){
            body.update(fpsRatio)
            if(body.state == RigidBody.STATE.MOVING){
                let speed = 0
                if(Math.abs(body.speed_x) > Math.abs(body.speed_y)) speed = body.speed_x
                else speed = body.speed_y
                if(Math.abs(body.speed_x) > 1 || Math.abs(body.speed_y) > 1) collisionPoints.add({x: body.x, y: body.y, speed: Math.abs(speed)})
                collision:
                if(Physics.touchingSolid(this.bodies, body)){
                    let last_x = body.getX()
                    let last_y = body.getY()

                    for(let distance = 0; distance < LevelRender.tile_size*4; distance+=0.1) {
                        for(let i = 0; i < 16; i++) {
                            body.x = last_x + Math.sin((i*24+180) * Math.PI/180)*distance
                            body.y = last_y + Math.cos((i*24+180) * Math.PI/180)*distance
                            if(!Physics.touchingSolid(this.bodies, body)){
                                break collision
                            }
                        }
                    }

                    body.x = last_x
                    body.y = last_y
                }
            }
        }
        return collisionPoints
    }

    static touchingSolid(bodies, shape) {
        for(let box of bodies){
            if(box != shape && (shape.inverse ? box.hide : !box.hide)){
                if(box.isTouching(shape)) return true
            }
        }
        if(shape.x < 0 || shape.x+shape.width > Render.width || shape.y < 0 || shape.y+shape.height > Render.height) return true
        return false
    }
}