import Physics from "./physics"

export class RigidBody {
    static STATE = Object.freeze(
        {
            SOLID: "solid",
            MOVING: "moving"
        }
    )

    constructor(x, y, state){
        this.x = x
        this.y = y
        this.speed_x = 0
        this.speed_y = 0
        this.state = state
        this.gravity = Physics.GRAVITY
        this.frction = Physics.FRICTION
        this.inGround = true
        this.tag = ""
        this.sliding = 0
        this.sliding_x = 0
    }

    getX() {return this.x}
    getY() {return this.y}
    getState() {return this.state}

    update(fpsRatio) {
        if(this.state == RigidBody.STATE.MOVING){
            this.speed_x *= Physics.FRICTION
            this.speed_y += Physics.GRAVITY
            
            let last_x = this.x
            for(let add = 0; add < 20; add++){
                this.x += this.speed_x/20
                if(Physics.touchingSolid(Physics.bodies, this)) break
            }
            //this.x += this.speed_x
            let next_x = this.x
            this.sliding = Math.max(0, this.sliding-(1*fpsRatio))
            if(Physics.touchingSolid(Physics.bodies, this)) {
                if(this.tag == "player") {
                    if(this.speed_y > 0) {
                        this.sliding = 10
                        this.sliding_x = -Math.sign(this.speed_x)
                    }
                }
                this.speed_x = 0
            }
            if(this.speed_y > 0 && this.sliding > 0){
                this.speed_y *= 0.5
            }
            this.x = last_x
            //this.y += this.speed_y
            for(let add = 0; add < 20; add++){
                this.y += this.speed_y/20
                if(Physics.touchingSolid(Physics.bodies, this)) break
            }
            if(Physics.touchingSolid(Physics.bodies, this)){
                if(this.speed_y > 0) this.inGround = true
                this.speed_y = 0
            }else{
                this.inGround = false
            }
            this.x = next_x
        }
    }

    isTouching(shape) {
        throw new Error("Is touching not implemented in class");
    }
}

export class Rectangle extends RigidBody {
    constructor(x, y, width, height, state, hide = false){
        super(x, y, state)

        this.width = width
        this.height = height
        this.hide = hide
    }

    getWidth() {return this.width}
    getHeight() {return this.height}

    isTouching(shape){
        if(shape instanceof Rectangle){
            if(shape.x + shape.getWidth() > this.x &&
                shape.x < this.x + this.getWidth() &&
                shape.y + shape.getHeight() > this.y &&
                shape.y < this.y + this.getHeight()
            ) {
                return true
            }else{
                return false
            }
        }else{
            if(shape.x > this.x &&
                shape.x < this.x + this.getWidth() &&
                shape.y > this.y &&
                shape.y > this.y + this.getHeight()
            ) {
                return true
            }else{
                return false
            }
        }
    }
}