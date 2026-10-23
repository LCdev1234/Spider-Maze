import { LevelRender } from "./level"
import { RigidBody } from "./objects"

export default class Physics {
    static GRAVITY = 0.9
    static FRICTION = 0.85
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

    update() {
        for(let body of this.bodies){
            body.update()
            if(body.state == RigidBody.STATE.MOVING){
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
    }

    static touchingSolid(bodies, shape) {
        for(let box of bodies){
            if(box != shape && !box.hide){
                if(box.isTouching(shape)) return true
            }
        }
        return false
    }
}