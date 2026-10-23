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
    }

    getX() {return this.x}
    getY() {return this.y}
    getState() {return this.state}

    update() {
        if(this.state == RigidBody.STATE.MOVING){
            this.speed_x *= Physics.FRICTION
            this.speed_y += Physics.GRAVITY
            
            let last_x = this.x
            this.x += this.speed_x
            let next_x = this.x
            if(Physics.touchingSolid(Physics.bodies, this)) this.speed_x = 0
            this.x = last_x
            this.y += this.speed_y
            if(Physics.touchingSolid(Physics.bodies, this)) this.speed_y = 0
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